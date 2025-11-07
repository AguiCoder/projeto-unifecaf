from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from app.models.enums import BoxStatus

if TYPE_CHECKING:
    from app.models.piece import Piece


class Box(SQLModel, table=True):
    """Model de Caixa para armazenar peças aprovadas"""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    status: BoxStatus = Field(default=BoxStatus.OPEN)
    opened_at: datetime = Field(default_factory=datetime.utcnow)
    closed_at: Optional[datetime] = Field(default=None)
    
    # Relacionamento com Piece (one-to-many)
    pieces: list["Piece"] = Relationship(back_populates="box")

