from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List
from datetime import datetime
from services.patient import models
from services.auth import auth
from services.auth.permission import Permission, require_permissions

routes = APIRouter()

@routes.get("/", response_model=List[models.PatientType])
@require_permissions([Permission.PATIENT_READ])
async def list_patients(offset: int = 0, limit: int = 20, pattern: str = "", tanggal_kunjungan : datetime = None, user = Depends(auth.verify_token), db: Session = Depends(models.get_db)):
    list_result = db.query(models.Patient)

    if tanggal_kunjungan is not None:
        list_result = list_result.filter(models.Patient.tanggal_kunjungan == tanggal_kunjungan.date())

    pattern = f"%{pattern}%"
    if pattern is not None:
        list_result = list_result.filter(or_(models.Patient.nama.ilike(pattern), models.Patient.dokter.ilike(pattern), models.Patient.diagnosis.ilike(pattern), models.Patient.tindakan.ilike(pattern)))

    return list_result.offset(offset).limit(limit)

@routes.post("/", response_model=models.PatientType)
@require_permissions([Permission.PATIENT_CREATE])
async def create_patient(patient: models.PatientType, user = Depends(auth.verify_token), db: Session = Depends(models.get_db)):
    created_patient = models.Patient(**patient.model_dump())
    db.add(created_patient)

    db.commit()
    db.refresh(created_patient)
    db.close()
    return created_patient

@routes.put("/{id}", response_model=models.PatientType)
@require_permissions([Permission.PATIENT_UPDATE])
async def update_patient(id: int, patient: models.PatientType, user = Depends(auth.verify_token), db: Session = Depends(models.get_db)):
    updated_patient = db.query(models.Patient).filter(models.Patient.id == id).first()
    if updated_patient is None:
        raise HTTPException(status_code=404, detail="patient not found")
    
    for key, value in patient.model_dump().items():
        setattr(updated_patient, key, value)

    db.commit()
    db.refresh(updated_patient)
    db.close()
    return updated_patient

@routes.delete("/{id}", response_model=models.PatientType)
@require_permissions([Permission.PATIENT_DELETE])
async def delete_patient(id: int, user = Depends(auth.verify_token), db: Session = Depends(models.get_db)):
    deleted_patient = db.query(models.Patient).filter(models.Patient.id == id).first()

    if deleted_patient is None:
        raise HTTPException(status_code=404, detail="patient not found")

    db.delete(deleted_patient)
    db.commit()
    db.close()
    return deleted_patient
