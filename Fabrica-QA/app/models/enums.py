from enum import Enum


class Color(str, Enum):
    """Cores permitidas para as peças"""
    AZUL = "azul"
    VERDE = "verde"


class PieceStatus(str, Enum):
    """Status de aprovação da peça"""
    APPROVED = "approved"
    REJECTED = "rejected"


class BoxStatus(str, Enum):
    """Status da caixa"""
    OPEN = "open"
    CLOSED = "closed"

