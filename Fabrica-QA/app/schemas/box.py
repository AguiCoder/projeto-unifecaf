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


class ReallocatedPieceInfo(BaseModel):
    """Informações sobre uma peça realocada"""
    piece_id: str = Field(..., description="ID da peça realocada")
    from_box_id: int = Field(..., description="ID da caixa de origem (excluída)")
    to_box_id: int = Field(..., description="ID da caixa de destino")


class BoxDeleteResponse(BaseModel):
    """Schema de resposta para exclusão de caixa"""
    message: str = Field(..., description="Mensagem de sucesso")
    reallocated_pieces: List[ReallocatedPieceInfo] = Field(
        default_factory=list,
        description="Lista de peças realocadas"
    )
    boxes_created: int = Field(
        default=0,
        description="Número de novas caixas criadas durante a realocação"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Caixa excluída com sucesso",
                "reallocated_pieces": [
                    {
                        "piece_id": "P001",
                        "from_box_id": 1,
                        "to_box_id": 2
                    }
                ],
                "boxes_created": 1
            }
        }
