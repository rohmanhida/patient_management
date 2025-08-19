import json, csv
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from services.patient import models
from typing import List

routes = APIRouter()

@routes.post("/import_json")
async def import_json(patient_data: List[models.ExtPatientType], db: Session = Depends(models.get_db)):
    # TODO: there should be some data cleaning here
    imported = []
    for patient in patient_data:
        imported.append(models.Patient(nama = patient.name, tanggal_lahir = patient.birth_date, tanggal_kunjungan = patient.visit_date, diagnosis = patient.diagnosis, tindakan = patient.action, dokter = patient.doctor))
    try:
        db.bulk_save_objects(imported)
    except Exception as e:
        HTTPException(status_code=500, detail=e)

    return {"success": f"{len(imported)} data imported successfully"}


@routes.get("/export_csv")
async def export_csv(db: Session = Depends(models.get_db)):
    result = db.query(models.Patient).all()
    result = [
        { c.name: getattr(p, c.name) for c in p.__table__.columns}
        for p in result
    ]
    with open('export.csv', 'w', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(result[0].keys())
        for item in result:
            writer.writerow(item.values())

    return {"success": f"{len(result)} data exported successfully"}
