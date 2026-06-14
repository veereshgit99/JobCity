"""Job-board ingestion services: RemoteOK and Greenhouse public boards."""
from __future__ import annotations

import hashlib
import logging
from datetime import datetime, timezone
from typing import Iterable

import httpx

from data.us_cities import US_CITIES

logger = logging.getLogger(__name__)


def _company_id(name: str) -> str:
    return f"co_{hashlib.md5(name.encode()).hexdigest()[:10]}"


def _slug(s: str) -> str:
    return "".join(c.lower() if c.isalnum() else "-" for c in s).strip("-")


def _color_for(name: str) -> str:
    h = hashlib.md5(name.encode()).hexdigest()
    return f"#{h[:6]}"


def _parse_location(location: str) -> tuple[str | None, str | None]:
    """Try to match a known US city in a free-form location string."""
    if not location:
        return None, None
    loc_lower = location.lower()
    for (city, state) in US_CITIES.keys():
        if city.lower() in loc_lower and state.lower() in loc_lower:
            return city, state
    # match by city alone (common for "San Francisco, CA, USA")
    for (city, state) in US_CITIES.keys():
        if city.lower() in loc_lower:
            return city, state
    return None, None


async def _upsert_company(db, name: str, color: str | None = None) -> str:
    company_id = _company_id(name)
    slug = _slug(name)
    existing = await db.companies.find_one({"company_id": company_id}, {"_id": 0})
    if existing:
        return company_id
    await db.companies.replace_one(
        {"slug": slug},
        {
            "company_id": company_id,
            "name": name,
            "slug": slug,
            "industry": "Unknown",
            "logo_url": "",
            "website": "",
            "hq_city": "",
            "hq_state": "",
            "color_hex": color or _color_for(name),
        },
        upsert=True,
    )
    return company_id


async def _upsert_job(db, *, source: str, source_id: str, company_name: str, title: str,
                     city: str, state: str, description: str, remote: bool,
                     source_url: str, posted_at: datetime) -> bool:
    if (city, state) not in US_CITIES:
        return False
    lat, lng = US_CITIES[(city, state)]
    company_id = await _upsert_company(db, company_name)
    # fetch color
    company = await db.companies.find_one({"company_id": company_id}, {"_id": 0})
    color = company.get("color_hex") if company else _color_for(company_name)
    job_id = f"job_{hashlib.md5(f'{source}|{source_id}'.encode()).hexdigest()[:14]}"
    await db.jobs.replace_one(
        {"job_id": job_id},
        {
            "job_id": job_id,
            "company_id": company_id,
            "company_name": company_name,
            "company_color": color,
            "title": title,
            "description": description[:2000],
            "city": city,
            "state": state,
            "lat": lat,
            "lng": lng,
            "remote": remote,
            "salary_min": None,
            "salary_max": None,
            "source": source,
            "source_url": source_url,
            "posted_at": posted_at.isoformat(),
            "is_active": True,
        },
        upsert=True,
    )
    return True


async def ingest_remoteok(db) -> int:
    """RemoteOK public feed (https://remoteok.com/api). Returns # ingested."""
    url = "https://remoteok.com/api"
    headers = {"User-Agent": "JobCity/1.0 (jobcity.test)"}
    try:
        async with httpx.AsyncClient(timeout=20.0, headers=headers) as client:
            r = await client.get(url)
            r.raise_for_status()
            data = r.json()
    except Exception as e:  # noqa: BLE001
        logger.warning("RemoteOK ingest failed: %s", e)
        return 0
    if not isinstance(data, list):
        return 0
    n = 0
    for item in data:
        if not isinstance(item, dict) or not item.get("id"):
            continue
        company = item.get("company") or "Unknown"
        title = item.get("position") or item.get("title") or "Engineer"
        loc = item.get("location") or ""
        city, state = _parse_location(loc)
        if not city or not state:
            continue  # skip non-US-resolvable jobs
        desc = item.get("description") or ""
        # strip HTML tags simply
        if "<" in desc and ">" in desc:
            import re
            desc = re.sub(r"<[^>]+>", " ", desc)
        date_str = item.get("date") or item.get("created_at") or ""
        try:
            posted = datetime.fromisoformat(date_str.replace("Z", "+00:00")) if date_str else datetime.now(timezone.utc)
        except Exception:
            posted = datetime.now(timezone.utc)
        ok = await _upsert_job(
            db,
            source="remoteok",
            source_id=str(item.get("id")),
            company_name=company,
            title=title,
            city=city,
            state=state,
            description=desc.strip(),
            remote=True,
            source_url=item.get("url") or item.get("apply_url") or "",
            posted_at=posted,
        )
        if ok:
            n += 1
    return n


async def ingest_greenhouse(db, boards: Iterable[str]) -> int:
    """Ingest jobs from Greenhouse public boards-api for each token."""
    n = 0
    async with httpx.AsyncClient(timeout=20.0) as client:
        for board in boards:
            try:
                r = await client.get(f"https://boards-api.greenhouse.io/v1/boards/{board}/jobs?content=true")
                if r.status_code != 200:
                    continue
                data = r.json()
            except Exception as e:  # noqa: BLE001
                logger.warning("Greenhouse %s failed: %s", board, e)
                continue
            for job in data.get("jobs", []):
                title = job.get("title") or "Engineer"
                location = (job.get("location") or {}).get("name") or ""
                city, state = _parse_location(location)
                if not city or not state:
                    continue
                desc = job.get("content") or ""
                if "<" in desc and ">" in desc:
                    import re
                    desc = re.sub(r"<[^>]+>", " ", desc)
                updated = job.get("updated_at") or job.get("created_at") or ""
                try:
                    posted = datetime.fromisoformat(updated.replace("Z", "+00:00")) if updated else datetime.now(timezone.utc)
                except Exception:
                    posted = datetime.now(timezone.utc)
                company_name = board.title()
                ok = await _upsert_job(
                    db,
                    source="greenhouse",
                    source_id=str(job.get("id")),
                    company_name=company_name,
                    title=title,
                    city=city,
                    state=state,
                    description=desc.strip(),
                    remote=False,
                    source_url=job.get("absolute_url") or "",
                    posted_at=posted,
                )
                if ok:
                    n += 1
    return n
