from typing import Dict, List
from pydantic import BaseModel, Field


class RejectionReasonCount(BaseModel):
    """Contagem de reprovações por motivo"""
    motivo: str
    quantidade: int


class FinalReportResponse(BaseModel):
    """Schema de resposta para relatório final consolidado"""
    total_aprovadas: int = Field(..., description="Total de peças aprovadas")
    total_reprovadas: int = Field(..., description="Total de peças reprovadas")
    motivo_contagem: List[RejectionReasonCount] = Field(
        default_factory=list,
        description="Contagem de reprovações por motivo"
    )
    total_caixas: int = Field(..., description="Total de caixas utilizadas (abertas e fechadas)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "total_aprovadas": 25,
                "total_reprovadas": 5,
                "motivo_contagem": [
                    {"motivo": "peso fora da faixa", "quantidade": 2},
                    {"motivo": "cor inválida", "quantidade": 1},
                    {"motivo": "comprimento fora da faixa", "quantidade": 2}
                ],
                "total_caixas": 3
            }
        }

