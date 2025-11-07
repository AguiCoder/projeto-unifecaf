from datetime import datetime
from sqlmodel import Session, select
from app.models.box import Box
from app.models.piece import Piece
from app.models.enums import BoxStatus, PieceStatus

# Capacidade máxima de peças por caixa
BOX_CAPACITY = 10


def find_or_create_open_box(session: Session) -> Box:
    """
    Busca uma caixa aberta ou cria uma nova se não houver.
    
    Args:
        session: Sessão do banco de dados
        
    Returns:
        Box aberta (mais antiga se houver múltiplas)
    """
    # Busca caixa aberta mais antiga
    statement = select(Box).where(Box.status == BoxStatus.OPEN).order_by(Box.opened_at)
    open_box = session.exec(statement).first()
    
    if open_box is None:
        # Cria nova caixa
        open_box = Box(
            status=BoxStatus.OPEN,
            opened_at=datetime.utcnow()
        )
        session.add(open_box)
        session.commit()
        session.refresh(open_box)
    
    return open_box


def allocate_piece_to_box(session: Session, piece: Piece, box: Box) -> Box:
    """
    Aloca uma peça aprovada em uma caixa.
    Fecha a caixa automaticamente quando atinge a capacidade máxima.
    
    Args:
        session: Sessão do banco de dados
        piece: Peça a ser alocada
        box: Caixa onde a peça será alocada
        
    Returns:
        Box atualizada (pode estar fechada se atingiu capacidade)
    """
    # Conta peças existentes na caixa (antes de adicionar a nova)
    statement = select(Piece).where(
        Piece.box_id == box.id,
        Piece.status == PieceStatus.APPROVED
    )
    pieces_in_box = session.exec(statement).all()
    piece_count = len(pieces_in_box)
    
    # Atualiza peça com box_id
    piece.box_id = box.id
    session.add(piece)
    
    # Se após adicionar esta peça atingir capacidade, fecha a caixa
    if (piece_count + 1) >= BOX_CAPACITY and box.status == BoxStatus.OPEN:
        box.status = BoxStatus.CLOSED
        box.closed_at = datetime.utcnow()
        session.add(box)
    
    session.commit()
    session.refresh(box)
    
    return box


def remove_piece_from_box(session: Session, piece: Piece) -> None:
    """
    Remove uma peça de sua caixa e ajusta o estado da caixa se necessário.
    
    Regras:
    - Se peça reprovada: remove diretamente
    - Se peça aprovada em caixa aberta: remove e ajusta contagem
    - Se peça aprovada em caixa fechada: remove mas mantém caixa fechada (auditoria)
    
    Args:
        session: Sessão do banco de dados
        piece: Peça a ser removida
    """
    if piece.status == PieceStatus.REJECTED:
        # Peça reprovada não está em caixa, apenas remove
        return
    
    if piece.box_id is None:
        # Peça aprovada mas sem caixa (não deveria acontecer, mas trata)
        return
    
    # Busca a caixa
    box = session.get(Box, piece.box_id)
    if box is None:
        return
    
    # Remove referência da peça
    piece.box_id = None
    session.add(piece)
    
    # Se caixa estava aberta, apenas remove (não precisa reabrir)
    # Se caixa estava fechada, mantém fechada para auditoria
    # (decisão de design: não reabrir caixas fechadas)
    
    session.commit()

