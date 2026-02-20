from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
app = FastAPI(title="Circular Economy Service")

DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    return conn

class CollectionRequest(BaseModel):
    requester_id: str
    waste_type: str
    estimated_kg: float

class CollectionUpdate(BaseModel):
    collector_id: str
    actual_kg: float
    status: str

@app.get("/health")
def health():
    return {"status": "ok", "service": "circular"}

@app.post("/collections", status_code=201)
def create_collection_request(req: CollectionRequest):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO waste_collections (requester_id, waste_type, estimated_kg) VALUES (%s, %s, %s) RETURNING *",
            (req.requester_id, req.waste_type, req.estimated_kg)
        )
        new_request = cur.fetchone()
        conn.commit()
        return new_request
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.get("/collections", response_model=List[dict])
def list_collections(status: Optional[str] = None):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        if status:
            cur.execute("SELECT * FROM waste_collections WHERE status = %s ORDER BY created_at DESC", (status,))
        else:
            cur.execute("SELECT * FROM waste_collections ORDER BY created_at DESC")
        return cur.fetchall()
    finally:
        cur.close()
        conn.close()

@app.patch("/collections/{collection_id}")
def update_collection(collection_id: str, update: CollectionUpdate):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # Update collection
        points = int(update.actual_kg * 10) # 10 points per kg
        cur.execute(
            "UPDATE waste_collections SET collector_id = %s, actual_kg = %s, status = %s, points_awarded = %s WHERE id = %s RETURNING *",
            (update.collector_id, update.actual_kg, update.status, points, collection_id)
        )
        updated = cur.fetchone()

        if not updated:
            raise HTTPException(status_code=404, detail="Collection request not found")

        # Update user points (wallet_balance in this simplified schema acts as points too for now)
        if update.status == 'completed':
            cur.execute(
                "UPDATE users SET wallet_balance = wallet_balance + %s WHERE id = %s",
                (points, updated['requester_id'])
            )

        conn.commit()
        return updated
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
