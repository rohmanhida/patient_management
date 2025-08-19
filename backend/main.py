from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.patient import routes as patient
from services.auth import auth
from services.dashboard import routes as dashboard
from services.integration import routes as integration
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://nextjs:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)
app.include_router(
    patient.routes,
    prefix="/patient",
    tags=["patient service"]
)

app.include_router(
    auth.routes,
    prefix="/auth",
    tags=["auth service"]
)

app.include_router(
    dashboard.routes,
    prefix="/dashboard",
    tags=["dashboard service"]
)
app.include_router(
    integration.routes,
    prefix="/integration",
    tags=["integration service"]
)
