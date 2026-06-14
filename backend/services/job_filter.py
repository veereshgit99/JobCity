"""Job title classifier — keeps only Software (incl. Full-Stack/Backend/Frontend/
DevOps/SRE/Forward-Deployed), ML, and Robotics roles. Used by ingestion + seed."""
from __future__ import annotations

import re

# Allow patterns (case-insensitive, matched anywhere in title)
SOFTWARE_PATTERNS = [
    r"software engineer", r"\bswe\b", r"software developer",
    r"full[- ]stack", r"fullstack",
    r"backend", r"back[- ]end",
    r"frontend", r"front[- ]end",
    r"web (?:engineer|developer)",
    r"mobile (?:engineer|developer)",
    r"ios engineer", r"android engineer",
    r"devops", r"\bsre\b", r"site reliability",
    r"platform engineer", r"infrastructure engineer", r"infra engineer",
    r"forward[- ]deployed",
    r"systems engineer", r"distributed systems",
    r"security engineer", r"application security",
    r"developer experience", r"\bdx engineer\b",
    r"build (?:and )?release", r"release engineer",
    r"cloud engineer", r"reliability engineer",
    r"game (?:engine )?(?:engineer|developer|programmer)",
    r"\bgo engineer\b", r"\brust engineer\b",
]
ML_PATTERNS = [
    r"machine learning",
    r"\bml engineer\b", r"\bml researcher?\b", r"\bml scientist\b",
    r"ml research",
    r"applied (?:scientist|ai|ml)",
    r"research engineer", r"research scientist",
    r"deep learning",
    r"\bnlp engineer\b", r"\bcv engineer\b", r"computer vision engineer",
    r"\bai engineer\b", r"\bai researcher?\b", r"\bai scientist\b",
    r"\bllm\b", r"foundation model", r"generative ai",
    r"data scientist", r"data engineer",
    r"ai\/ml",
]
ROBOTICS_PATTERNS = [
    r"robotics",
    r"\brobot engineer\b",
    r"perception engineer", r"controls engineer",
    r"motion planning", r"slam engineer",
    r"\bautonomy\b", r"autonomous (?:vehicle|driving|systems)",
    r"firmware engineer", r"embedded engineer", r"embedded software",
]

# Deny patterns — even if a soft match above hits, these reject the role.
DENY_PATTERNS = [
    r"\bsales\b", r"sales (?:engineer|executive|representative)",
    r"\bmarketing\b", r"growth marketing",
    r"\brecruit", r"\bhr\b", r"people (?:ops|operations|partner)",
    r"\blegal\b", r"counsel",
    r"\bfinance\b", r"accounting", r"controller",
    r"customer (?:success|support|service)",
    r"administrative", r"executive assistant",
    r"\bbusiness\b (?:development|operations|analyst)",
    r"product manager", r"\bpm\b(?!s|c)",  # block "PM" but not "PMs"
    r"product designer", r"\bux designer\b", r"\bui designer\b",
    r"brand designer", r"graphic designer",
    r"copywriter", r"content writer", r"editor",
    r"event manager", r"office manager",
]

_ALLOW_RE = re.compile("|".join(SOFTWARE_PATTERNS + ML_PATTERNS + ROBOTICS_PATTERNS), re.IGNORECASE)
_DENY_RE = re.compile("|".join(DENY_PATTERNS), re.IGNORECASE)


def category(title: str) -> str | None:
    """Returns 'software' | 'ml' | 'robotics' | None."""
    if not title:
        return None
    t = title.lower()
    if _DENY_RE.search(t):
        return None
    for pat in SOFTWARE_PATTERNS:
        if re.search(pat, t):
            return "software"
    for pat in ML_PATTERNS:
        if re.search(pat, t):
            return "ml"
    for pat in ROBOTICS_PATTERNS:
        if re.search(pat, t):
            return "robotics"
    return None


def is_allowed(title: str) -> bool:
    return category(title) is not None
