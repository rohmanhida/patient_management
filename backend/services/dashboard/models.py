from pydantic import BaseModel
from datetime import datetime

class PatientsbyDoctor(BaseModel):
    dokter: str
    total: int

class PatientsbyDate(BaseModel):
    tanggal_kunjungan: datetime
    total: int
