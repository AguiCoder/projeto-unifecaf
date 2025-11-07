from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship, Column, JSON
from app.models.enums import Color, PieceStatus

if TYPE_CHECKING:
    from app.models.box import Box


class Piece(SQLModel, table=True):
    """Model de Peça fabricada"""
    
    id: str = Field(primary_key=True, description="Identificador único da peça")
    peso: float = Field(description="Peso em gramas")
    cor: Color = Field(description="Cor da peça")
    comprimento: float = Field(description="Comprimento em centímetros")
    status: PieceStatus = Field(description="Status de aprovação")
    rejection_reasons: List[str] = Field(
        default_factory=list,
        sa_column=Column(JSON),
        description="Lista de motivos de reprovação"
    )
    box_id: Optional[int] = Field(default=None, foreign_key="box.id", description="ID da caixa onde está armazenada")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Data de criação")
    
    # Relacionamento com Box (many-to-one)
    box: Optional["Box"] = Relationship(back_populates="pieces")

