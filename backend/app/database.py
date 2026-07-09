import json
import sqlite3
from pathlib import Path
from typing import Any, Dict, List, Optional


DB_PATH = Path("coopilot.db")


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_name TEXT NOT NULL,
                job_title TEXT NOT NULL,
                resume_text TEXT NOT NULL,
                job_text TEXT NOT NULL,
                match_score INTEGER NOT NULL,
                matched_skills TEXT NOT NULL,
                missing_skills TEXT NOT NULL,
                suggestions TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'Applied',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        connection.commit()


def row_to_application(row: sqlite3.Row) -> Dict[str, Any]:
    return {
        "id": row["id"],
        "company_name": row["company_name"],
        "job_title": row["job_title"],
        "resume_text": row["resume_text"],
        "job_text": row["job_text"],
        "match_score": row["match_score"],
        "matched_skills": json.loads(row["matched_skills"]),
        "missing_skills": json.loads(row["missing_skills"]),
        "suggestions": json.loads(row["suggestions"]),
        "status": row["status"],
        "created_at": row["created_at"],
    }


def create_application(application: Dict[str, Any]) -> Dict[str, Any]:
    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO applications (
                company_name,
                job_title,
                resume_text,
                job_text,
                match_score,
                matched_skills,
                missing_skills,
                suggestions,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                application["company_name"],
                application["job_title"],
                application["resume_text"],
                application["job_text"],
                application["match_score"],
                json.dumps(application["matched_skills"]),
                json.dumps(application["missing_skills"]),
                json.dumps(application["suggestions"]),
                application["status"],
            ),
        )
        connection.commit()

        application_id = cursor.lastrowid
        saved = connection.execute(
            "SELECT * FROM applications WHERE id = ?",
            (application_id,),
        ).fetchone()

        return row_to_application(saved)


def list_applications() -> List[Dict[str, Any]]:
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT * FROM applications ORDER BY created_at DESC"
        ).fetchall()

        return [row_to_application(row) for row in rows]


def update_application_status(
    application_id: int,
    status: str,
) -> Optional[Dict[str, Any]]:
    with get_connection() as connection:
        connection.execute(
            "UPDATE applications SET status = ? WHERE id = ?",
            (status, application_id),
        )
        connection.commit()

        row = connection.execute(
            "SELECT * FROM applications WHERE id = ?",
            (application_id,),
        ).fetchone()

        if row is None:
            return None

        return row_to_application(row)


def delete_application(application_id: int) -> bool:
    with get_connection() as connection:
        cursor = connection.execute(
            "DELETE FROM applications WHERE id = ?",
            (application_id,),
        )
        connection.commit()

        return cursor.rowcount > 0