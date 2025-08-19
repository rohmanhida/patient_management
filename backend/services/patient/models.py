from datetime import datetime
from db import Base, SessionLocal, engine
from sqlalchemy import Column, Integer, String, Date
from pydantic import BaseModel

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String, index=True)
    tanggal_lahir = Column(Date)
    tanggal_kunjungan = Column(Date)
    diagnosis = Column(String)
    tindakan = Column(String)
    dokter = Column(String)

class PatientType(BaseModel):
    id: int = 0
    nama: str
    tanggal_lahir: datetime
    tanggal_kunjungan: datetime
    diagnosis: str
    tindakan: str
    dokter: str

class ExtPatientType(BaseModel):
    name: str
    birth_date: datetime
    visit_date: datetime
    diagnosis: str
    action: str
    doctor: str

Base.metadata.create_all(bind=engine)
