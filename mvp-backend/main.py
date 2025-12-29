from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import (Column, Integer, String, create_engine)
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from typing import List, Optional
from pydantic import BaseModel

DATABASE_URL = "sqlite:///./vehicles.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False)
Base = declarative_base()

class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    amp_number = Column(String, index=True)
    driver_name = Column(String)
    status = Column(String)
    position = Column(String)
    cargo = Column(String)
    alert = Column(String)

# Create tables
Base.metadata.create_all(bind=engine)

class VehicleCreateSchema(BaseModel):
    amp_number: str
    driver_name: str
    status: Optional[str] = ""
    position: Optional[str] = ""
    cargo: Optional[str] = ""
    alert: Optional[str] = ""

    class Config:
        orm_mode = True

class VehicleSchema(VehicleCreateSchema):
    id: int

app = FastAPI(
    title="Port Operations DB API",
    description="API for managing vehicle operations with a database"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



@app.get("/vehicles", response_model=List[VehicleSchema])
def list_vehicles(db: Session = Depends(get_db)):
    return db.query(Vehicle).all()



@app.post("/vehicles", response_model=VehicleSchema)
def add_vehicle(vehicle: VehicleCreateSchema, db: Session = Depends(get_db)):
    db_vehicle = Vehicle(
        amp_number=vehicle.amp_number,
        driver_name=vehicle.driver_name,
        status=vehicle.status,
        position=vehicle.position,
        cargo=vehicle.cargo,
        alert=vehicle.alert
    )
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle



@app.put("/vehicles/{vehicle_id}", response_model=VehicleSchema)
def update_vehicle(vehicle_id: int, vehicle: VehicleSchema, db: Session = Depends(get_db)):
    db_vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    for field in ['amp_number', 'driver_name', 'status', 'position', 'cargo', 'alert']:
        setattr(db_vehicle, field, getattr(vehicle, field))
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle



@app.delete("/vehicles/{vehicle_id}")
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    db_vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    db.delete(db_vehicle)
    db.commit()
    return {"detail": "Vehicle deleted"}



@app.get("/")
def root():
    return {"msg": "FastAPI backend with SQLite"}
