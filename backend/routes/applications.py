"""Application routes."""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field

from auth_utils import get_current_user
from db import get_db

router = APIRouter(prefix="/api/applications", tags=["applications"])


class CreateApplicationIn(BaseModel):
    job_id: str
    cover_note: str | None = Field(default=None, max_length=1000)


@router.post("")
async def create_application(body: CreateApplicationIn, request: Request):
    user = await get_current_user(request)
    db = get_db()
    applicant = await db.applicants.find_one({"user_id": user["user_id"]}, {"_id": 0})
    if not applicant:
        raise HTTPException(status_code=400, detail="No applicant profile")

    job = await db.jobs.find_one({"job_id": body.job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    existing = await db.applications.find_one(
        {"applicant_id": applicant["applicant_id"], "job_id": body.job_id}, {"_id": 0}
    )
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this job")

    doc = {
        "applicant_id": applicant["applicant_id"],
        "job_id": body.job_id,
        "job_title": job["title"],
        "company_name": job["company_name"],
        "company_id": job["company_id"],
        "city": job["city"],
        "state": job["state"],
        "status": "submitted",
        "cover_note": body.cover_note or "",
        "applied_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.applications.insert_one(doc)
    await db.applicants.update_one(
        {"applicant_id": applicant["applicant_id"]},
        {"$inc": {"applications_count": 1}, "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}},
    )
    doc.pop("_id", None)
    return {"application": doc}


@router.get("/mine")
async def my_applications(request: Request):
    user = await get_current_user(request)
    db = get_db()
    applicant = await db.applicants.find_one({"user_id": user["user_id"]}, {"_id": 0})
    if not applicant:
        return {"items": [], "applicant": None}
    items = (
        await db.applications.find({"applicant_id": applicant["applicant_id"]}, {"_id": 0})
        .sort("applied_at", -1)
        .to_list(length=500)
    )
    return {"items": items, "applicant": applicant}
