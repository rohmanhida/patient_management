from fastapi import APIRouter, Depends
from services.patient import models as patient_models
from services.dashboard import models as dashboard_models
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

routes = APIRouter()

@routes.get("/patients_by_doctor", response_model=List[dashboard_models.PatientsbyDoctor])
async def patients_by_doctor(db: Session = Depends(patient_models.get_db)):
    results = db.query(patient_models.Patient.dokter, func.count(patient_models.Patient.id).label('total')).group_by(patient_models.Patient.dokter).all()
    return [dashboard_models.PatientsbyDoctor(dokter=dokter, total=total) for dokter, total in results]

@routes.get("/patients_by_date", response_model=List[dashboard_models.PatientsbyDate])
async def patients_by_date(db: Session = Depends(patient_models.get_db)):
    results = db.query(patient_models.Patient.tanggal_kunjungan, func.count(patient_models.Patient.id).label('total')).group_by(patient_models.Patient.tanggal_kunjungan).all()
    return [dashboard_models.PatientsbyDate(tanggal_kunjungan=tanggal_kunjungan, total=total) for tanggal_kunjungan, total in results]
