"""Company routes."""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from db import get_db

router = APIRouter(prefix="/api/companies", tags=["companies"])


@router.get("")
async def list_companies(q: Optional[str] = None, limit: int = Query(100, le=200)):
    db = get_db()
    query: dict = {}
    if q:
        query["name"] = {"$regex": q, "$options": "i"}
    items = await db.companies.find(query, {"_id": 0}).sort("name", 1).limit(limit).to_list(length=limit)
    # attach job count quickly
    for c in items:
        c["jobs_count"] = await db.jobs.count_documents({"company_id": c["company_id"], "is_active": True})
    return {"items": items}


@router.get("/{company_id}")
async def get_company(company_id: str):
    db = get_db()
    c = await db.companies.find_one({"company_id": company_id}, {"_id": 0})
    if not c:
        raise HTTPException(status_code=404, detail="Company not found")
    jobs = await db.jobs.find({"company_id": company_id, "is_active": True}, {"_id": 0}).sort("posted_at", -1).limit(100).to_list(length=100)
    return {"company": c, "jobs": jobs}
