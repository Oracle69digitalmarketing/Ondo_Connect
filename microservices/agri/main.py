from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()
app = FastAPI(title="Ondo Connect Agri Service")

DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)

class Crop(BaseModel):
    type: str # 'cocoa'|'cassava'|'maize'
    hectares: float
    planted_at: Optional[datetime] = None

class FarmerRegister(BaseModel):
    user_id: str
    subscription_status: bool = True

@app.get("/health")
def health():
    return {"status": "ok", "service": "agri-service"}

@app.post("/farmers")
def register_farmer(farmer: FarmerRegister):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO farmers (user_id, subscription_status) VALUES (%s, %s) ON CONFLICT (user_id) DO UPDATE SET subscription_status = EXCLUDED.subscription_status RETURNING *",
            (farmer.user_id, farmer.subscription_status)
        )
        new_farmer = cur.fetchone()
        conn.commit()
        return new_farmer
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.post("/crops")
def add_crop(farmer_id: str, crop: Crop):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO crops (farmer_id, type, hectares, planted_at) VALUES (%s, %s, %s, %s) RETURNING *",
            (farmer_id, crop.type, crop.hectares, crop.planted_at or datetime.now())
        )
        new_crop = cur.fetchone()
        conn.commit()
        return new_crop
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.get("/advice/{user_id}")
def get_advice(user_id: str):
    # In a real app, integrate with weather/pest models here.
    return {
        "user_id": user_id,
        "advice": [
            "Protect your cocoa beans from upcoming rain in Odigbo.",
            "Soil moisture in your area is optimal for cassava planting."
        ],
        "weather_alert": "Heavy rain predicted in 24 hours."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 3003)))
