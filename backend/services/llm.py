"""Claude Sonnet 4.5 powered job-applicant match score via Emergent LLM key."""
from __future__ import annotations

import json
import logging
import os
import re
import uuid

from emergentintegrations.llm.chat import LlmChat, UserMessage

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "You are a brutally honest, terse career coach. Given a job posting and an applicant profile, "
    "output STRICT JSON only — no markdown fences, no commentary. Schema:\n"
    "{\n"
    '  "score": <int 0-100>,\n'
    '  "rationale": "<2 sentences max>",\n'
    '  "strengths": ["<short bullet 1>", ... up to 5 bullets],\n'
    '  "gaps": ["<short bullet>", ... up to 3 bullets]\n'
    "}\n"
    "Be specific. Cite the applicant's skills and experience level. If the role is clearly wrong (e.g. designer applying to ML role), score below 35."
)

ROLE_BRIEF_PROMPT = (
    "You are a tech-recruiter. Given a job posting, output STRICT JSON only — no markdown fences. Schema:\n"
    "{\n"
    '  "summary": "<2 sentences, plain English, what this role actually does>",\n'
    '  "required_skills": ["<skill>", ... 4-7 items],\n'
    '  "nice_to_have": ["<skill>", ... 2-5 items],\n'
    '  "seniority": "<entry|mid|senior|staff|principal>"\n'
    "}\n"
    "Skills should be concrete (e.g. 'Go', 'Kubernetes', 'distributed systems') — not fluff like 'team player'. "
    "Infer reasonable values when the description is sparse."
)


def _strip_json(text: str) -> str:
    """Strip markdown fences / leading text and return the first JSON object."""
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text.strip(), flags=re.IGNORECASE)
    # Find first { ... } block
    m = re.search(r"\{[\s\S]*\}", text)
    return m.group(0) if m else text


async def job_match_score(*, job: dict, applicant: dict) -> dict:
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise RuntimeError("EMERGENT_LLM_KEY not configured")

    job_text = (
        f"Job title: {job.get('title', '')}\n"
        f"Company: {job.get('company_name', '')}\n"
        f"Location: {job.get('city', '')}, {job.get('state', '')}{' · REMOTE OK' if job.get('remote') else ''}\n"
        f"Description: {(job.get('description') or '')[:1500]}"
    )
    skills = ", ".join(applicant.get("skills") or []) or "(none listed)"
    applicant_text = (
        f"Applicant: {applicant.get('display_name', '')}\n"
        f"Headline: {applicant.get('headline', '') or '(none)'}\n"
        f"Experience level: {applicant.get('experience_level', 'entry')}\n"
        f"Location: {applicant.get('location_city', '')}, {applicant.get('location_state', '')}\n"
        f"Skills: {skills}\n"
        f"GitHub commits (30d): {applicant.get('github_commits_30d', 0)}\n"
        f"Bio: {(applicant.get('bio') or '')[:600]}"
    )
    prompt = (
        f"JOB POSTING:\n{job_text}\n\n"
        f"APPLICANT PROFILE:\n{applicant_text}\n\n"
        "Return the JSON now."
    )

    chat = (
        LlmChat(
            api_key=api_key,
            session_id=f"match-{uuid.uuid4().hex[:10]}",
            system_message=SYSTEM_PROMPT,
        )
        .with_model("anthropic", "claude-sonnet-4-5-20250929")
        .with_params(max_tokens=512)
    )

    raw = await chat.send_message(UserMessage(text=prompt))
    text = raw if isinstance(raw, str) else getattr(raw, "content", str(raw))
    try:
        data = json.loads(_strip_json(text))
    except Exception:
        logger.warning("Failed to parse LLM JSON; raw=%r", text[:300])
        data = {
            "score": 50,
            "rationale": "Could not parse match details. Please retry.",
            "strengths": [],
            "gaps": [],
        }

    # Coerce/clip
    try:
        data["score"] = max(0, min(100, int(data.get("score", 0))))
    except Exception:
        data["score"] = 0
    data["rationale"] = str(data.get("rationale", ""))[:400]
    data["strengths"] = [str(s)[:120] for s in (data.get("strengths") or [])[:5]]
    data["gaps"] = [str(s)[:120] for s in (data.get("gaps") or [])[:3]]
    return data


async def job_role_brief(*, job: dict) -> dict:
    """LLM-generated summary + skill list for a single job. Independent of applicant."""
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise RuntimeError("EMERGENT_LLM_KEY not configured")

    prompt = (
        f"Job title: {job.get('title', '')}\n"
        f"Company: {job.get('company_name', '')}\n"
        f"Location: {job.get('city', '')}, {job.get('state', '')}{' · REMOTE OK' if job.get('remote') else ''}\n"
        f"Description: {(job.get('description') or '')[:1800]}\n\n"
        "Return the JSON now."
    )

    chat = (
        LlmChat(
            api_key=api_key,
            session_id=f"brief-{uuid.uuid4().hex[:10]}",
            system_message=ROLE_BRIEF_PROMPT,
        )
        .with_model("anthropic", "claude-sonnet-4-5-20250929")
        .with_params(max_tokens=400)
    )
    raw = await chat.send_message(UserMessage(text=prompt))
    text = raw if isinstance(raw, str) else getattr(raw, "content", str(raw))
    try:
        data = json.loads(_strip_json(text))
    except Exception:
        logger.warning("Failed to parse LLM JSON; raw=%r", text[:300])
        data = {"summary": "", "required_skills": [], "nice_to_have": [], "seniority": "mid"}
    data["summary"] = str(data.get("summary", ""))[:500]
    data["required_skills"] = [str(s)[:60] for s in (data.get("required_skills") or [])[:8]]
    data["nice_to_have"] = [str(s)[:60] for s in (data.get("nice_to_have") or [])[:6]]
    data["seniority"] = str(data.get("seniority", "mid"))[:20]
    return data
