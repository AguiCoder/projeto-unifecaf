from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from app.models.enums import BoxStatus
from app.schemas.piece import PieceResponse


class BoxResponse(BaseModel):
    """Schema de resposta para caixa"""
    id: int
    status: BoxStatus
    opened_at: datetime
    closed_at: Optional[datetime] = None
    piece_count: int = Field(..., description="Quantidade de peças na caixa")
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "status": "closed",
                "opened_at": "2024-01-01T12:00:00",
                "closed_at": "2024-01-01T12:30:00",
                "piece_count": 10
            }
        }


class BoxDetailResponse(BoxResponse):
    """Schema de resposta detalhada para caixa com lista de peças"""
    pieces: List[PieceResponse] = Field(default_factory=list)


class BoxListResponse(BaseModel):
    """Schema de resposta para lista de caixas"""
    items: List[BoxResponse]
    total: int

