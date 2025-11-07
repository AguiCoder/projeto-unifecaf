from fastapi import APIRouter
from app.api.v1 import pieces, boxes, reports

api_router = APIRouter()

api_router.include_router(pieces.router, prefix="/v1")
api_router.include_router(boxes.router, prefix="/v1")
api_router.include_router(reports.router, prefix="/v1")

