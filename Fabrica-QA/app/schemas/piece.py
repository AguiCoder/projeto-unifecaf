from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from app.models.enums import Color, PieceStatus


class PieceCreate(BaseModel):
    """Schema para criação de peça"""
    id: str = Field(..., description="Identificador único da peça")
    peso: float = Field(..., gt=0, description="Peso em gramas")
    cor: Color = Field(..., description="Cor da peça (azul ou verde)")
    comprimento: float = Field(..., gt=0, description="Comprimento em centímetros")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "P001",
                "peso": 100.0,
                "cor": "azul",
                "comprimento": 15.0
            }
        }


class PieceResponse(BaseModel):
    """Schema de resposta para peça"""
    id: str
    peso: float
    cor: Color
    comprimento: float
    status: PieceStatus
    rejection_reasons: List[str] = Field(default_factory=list)
    box_id: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "P001",
                "peso": 100.0,
                "cor": "azul",
                "comprimento": 15.0,
                "status": "approved",
                "rejection_reasons": [],
                "box_id": 1,
                "created_at": "2024-01-01T12:00:00"
            }
        }


class PieceListResponse(BaseModel):
    """Schema de resposta para lista paginada de peças"""
    items: List[PieceResponse]
    total: int
    limit: int
    offset: int

