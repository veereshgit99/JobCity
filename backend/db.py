"""Mongo client singleton and index setup."""
import os
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None


def init_db() -> AsyncIOMotorDatabase:
    global _client, _db
    if _db is None:
        _client = AsyncIOMotorClient(os.environ["MONGO_URL"])
        _db = _client[os.environ["DB_NAME"]]
    return _db


def get_db() -> AsyncIOMotorDatabase:
    if _db is None:
        return init_db()
    return _db


async def setup_indexes() -> None:
    db = get_db()
    # users
    await db.users.create_index("email", unique=True)
    await db.users.create_index("user_id", unique=True)
    # applicants
    await db.applicants.create_index("user_id", unique=True)
    await db.applicants.create_index("applicant_id", unique=True)
    # companies
    await db.companies.create_index("slug", unique=True)
    # jobs
    await db.jobs.create_index([("city", 1), ("state", 1)])
    await db.jobs.create_index("company_id")
    await db.jobs.create_index([("is_active", 1), ("posted_at", -1)])
    await db.jobs.create_index("job_id", unique=True)
    # applications
    await db.applications.create_index([("applicant_id", 1), ("applied_at", -1)])
    await db.applications.create_index([("applicant_id", 1), ("job_id", 1)], unique=True)
    # sessions / auth
    await db.user_sessions.create_index("session_token", unique=True)
    await db.user_sessions.create_index("expires_at", expireAfterSeconds=0)
    await db.password_reset_tokens.create_index("expires_at", expireAfterSeconds=0)
    await db.login_attempts.create_index("identifier")
