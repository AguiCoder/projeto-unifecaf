from typing import Dict, List
from app.models.enums import PieceStatus, Color
from app.schemas.piece import PieceCreate


# Constantes de critérios de qualidade
PESO_MIN = 95.0
PESO_MAX = 105.0
COMPRIMENTO_MIN = 10.0
COMPRIMENTO_MAX = 20.0
CORES_PERMITIDAS = [Color.AZUL, Color.VERDE]


def evaluate_piece(piece_data: PieceCreate) -> Dict[str, any]:
    """
    Avalia uma peça de acordo com os critérios de qualidade.
    
    Critérios:
    - Peso entre 95g e 105g
    - Cor azul ou verde
    - Comprimento entre 10cm e 20cm
    
    Args:
        piece_data: Dados da peça a ser avaliada
        
    Returns:
        Dict com 'status' (PieceStatus) e 'rejection_reasons' (List[str])
    """
    rejection_reasons: List[str] = []
    
    # Verifica peso
    if piece_data.peso < PESO_MIN or piece_data.peso > PESO_MAX:
        rejection_reasons.append("peso fora da faixa")
    
    # Verifica cor
    if piece_data.cor not in CORES_PERMITIDAS:
        rejection_reasons.append("cor inválida")
    
    # Verifica comprimento
    if piece_data.comprimento < COMPRIMENTO_MIN or piece_data.comprimento > COMPRIMENTO_MAX:
        rejection_reasons.append("comprimento fora da faixa")
    
    # Determina status
    status = PieceStatus.APPROVED if len(rejection_reasons) == 0 else PieceStatus.REJECTED
    
    return {
        "status": status,
        "rejection_reasons": rejection_reasons
    }

