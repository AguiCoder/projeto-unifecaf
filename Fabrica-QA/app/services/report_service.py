from collections import Counter
from sqlmodel import Session, select, func
from app.models.piece import Piece
from app.models.box import Box
from app.models.enums import PieceStatus, BoxStatus
from app.schemas.report import FinalReportResponse, RejectionReasonCount


def generate_final_report(session: Session) -> FinalReportResponse:
    """
    Gera relatório final consolidado com estatísticas de produção.
    
    Args:
        session: Sessão do banco de dados
        
    Returns:
        FinalReportResponse com totais e contagens
    """
    # Conta peças aprovadas
    statement_approved = select(func.count(Piece.id)).where(Piece.status == PieceStatus.APPROVED)
    total_aprovadas = session.exec(statement_approved).one() or 0
    
    # Conta peças reprovadas
    statement_rejected = select(func.count(Piece.id)).where(Piece.status == PieceStatus.REJECTED)
    total_reprovadas = session.exec(statement_rejected).one() or 0
    
    # Busca todas as peças reprovadas para contar motivos
    statement_rejected_pieces = select(Piece).where(Piece.status == PieceStatus.REJECTED)
    rejected_pieces = session.exec(statement_rejected_pieces).all()
    
    # Conta motivos de reprovação
    motivo_counter = Counter()
    for piece in rejected_pieces:
        for motivo in piece.rejection_reasons:
            motivo_counter[motivo] += 1
    
    # Converte para lista de RejectionReasonCount
    motivo_contagem = [
        RejectionReasonCount(motivo=motivo, quantidade=quantidade)
        for motivo, quantidade in motivo_counter.items()
    ]
    
    # Conta caixas fechadas
    statement_closed_boxes = select(func.count(Box.id)).where(Box.status == BoxStatus.CLOSED)
    total_caixas = session.exec(statement_closed_boxes).one() or 0
    
    return FinalReportResponse(
        total_aprovadas=total_aprovadas,
        total_reprovadas=total_reprovadas,
        motivo_contagem=motivo_contagem,
        total_caixas=total_caixas
    )

