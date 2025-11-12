from datetime import datetime
from typing import Any, Dict, List, Optional
from sqlmodel import Session, select
from app.models.box import Box
from app.models.piece import Piece
from app.models.enums import BoxStatus, PieceStatus

# Capacidade máxima de peças por caixa
BOX_CAPACITY = 10


def find_or_create_open_box(session: Session) -> Box:
    """
    Busca uma caixa aberta ou cria uma nova se não houver.
    Garante que não existam múltiplas caixas abertas (fecha as extras).
    
    Args:
        session: Sessão do banco de dados
        
    Returns:
        Box aberta (mais antiga se houver múltiplas)
    """
    # Busca todas as caixas abertas ordenadas por data de abertura
    statement = select(Box).where(Box.status == BoxStatus.OPEN).order_by(Box.opened_at)
    open_boxes = session.exec(statement).all()
    
    if len(open_boxes) == 0:
        # Cria nova caixa
        open_box = Box(
            status=BoxStatus.OPEN,
            opened_at=datetime.utcnow()
        )
        session.add(open_box)
        session.commit()
        session.refresh(open_box)
        return open_box
    
    # Mantém apenas a mais antiga aberta, fecha as outras
    open_box = open_boxes[0]
    
    if len(open_boxes) > 1:
        # Fecha todas as caixas abertas extras (exceto a mais antiga)
        for extra_box in open_boxes[1:]:
            # Verifica se a caixa tem peças antes de fechar
            piece_count = count_pieces_in_box(session, extra_box.id)
            if piece_count >= BOX_CAPACITY:
                # Se já tem 10 ou mais peças, fecha normalmente
                extra_box.status = BoxStatus.CLOSED
                extra_box.closed_at = datetime.utcnow()
            else:
                # Se tem menos de 10 peças, move para a caixa principal antes de fechar
                pieces_statement = select(Piece).where(
                    Piece.box_id == extra_box.id,
                    Piece.status == PieceStatus.APPROVED
                ).order_by(Piece.created_at)
                pieces_to_move = session.exec(pieces_statement).all()
                
                for p in pieces_to_move:
                    p.box_id = open_box.id
                    session.add(p)
                
                # Fecha a caixa extra
                extra_box.status = BoxStatus.CLOSED
                extra_box.closed_at = datetime.utcnow()
            
            session.add(extra_box)
        
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


def count_pieces_in_box(session: Session, box_id: int) -> int:
    """
    Conta quantas peças aprovadas existem em uma caixa.
    
    Args:
        session: Sessão do banco de dados
        box_id: ID da caixa
        
    Returns:
        Número de peças aprovadas na caixa
    """
    statement = select(Piece).where(
        Piece.box_id == box_id,
        Piece.status == PieceStatus.APPROVED
    )
    pieces = session.exec(statement).all()
    return len(pieces)


def remove_piece_from_box(session: Session, piece: Piece) -> Dict[str, Any]:
    """
    Remove uma peça de sua caixa e ajusta o estado da caixa se necessário.
    
    Regras:
    - Se peça reprovada: remove diretamente
    - Se peça aprovada em caixa aberta: remove normalmente
    - Se peça aprovada em caixa fechada:
      - Se restarem < 10 peças após remoção:
        - Se houver caixa aberta: move peças da aberta para a fechada até completar 10
        - Se não houver caixa aberta: reabre a caixa fechada
    
    Args:
        session: Sessão do banco de dados
        piece: Peça a ser removida
        
    Returns:
        Dicionário com informações sobre peças movidas:
        - moved_pieces: Lista de IDs das peças movidas (None se nenhuma)
        - from_box_id: ID da caixa de origem (None se nenhuma)
        - to_box_id: ID da caixa de destino (None se nenhuma)
    """
    result = {
        "moved_pieces": None,
        "from_box_id": None,
        "to_box_id": None
    }
    
    if piece.status == PieceStatus.REJECTED:
        # Peça reprovada não está em caixa, apenas remove
        return result
    
    if piece.box_id is None:
        # Peça aprovada mas sem caixa (não deveria acontecer, mas trata)
        return result
    
    # Busca a caixa
    box = session.get(Box, piece.box_id)
    if box is None:
        return result
    
    # Remove referência da peça
    piece.box_id = None
    session.add(piece)
    session.flush()  # Flush para garantir que a remoção seja refletida
    
    # Se caixa estava aberta, apenas remove (não precisa fazer mais nada)
    if box.status == BoxStatus.OPEN:
        session.commit()
        return result
    
    # Se caixa estava fechada, verifica se precisa de ajuste
    remaining_pieces = count_pieces_in_box(session, box.id)
    
    if remaining_pieces < BOX_CAPACITY:
        # Busca caixa aberta
        open_box_statement = select(Box).where(Box.status == BoxStatus.OPEN).order_by(Box.opened_at)
        open_box = session.exec(open_box_statement).first()
        
        if open_box is not None:
            # Existe caixa aberta: move peças necessárias
            pieces_needed = BOX_CAPACITY - remaining_pieces
            
            # Busca peças da caixa aberta (ordena por created_at para manter ordem)
            open_box_pieces_statement = select(Piece).where(
                Piece.box_id == open_box.id,
                Piece.status == PieceStatus.APPROVED
            ).order_by(Piece.created_at)
            open_box_pieces = session.exec(open_box_pieces_statement).all()
            
            # Move apenas o necessário
            pieces_to_move = open_box_pieces[:pieces_needed]
            moved_piece_ids = []
            
            for p in pieces_to_move:
                p.box_id = box.id
                session.add(p)
                moved_piece_ids.append(p.id)
            
            if moved_piece_ids:
                result["moved_pieces"] = moved_piece_ids
                result["from_box_id"] = open_box.id
                result["to_box_id"] = box.id
                
                # Se a caixa aberta ficou vazia, pode ser removida ou mantida aberta
                # (de acordo com a regra de não ter mais de 1 caixa aberta)
                remaining_in_open = len(open_box_pieces) - len(pieces_to_move)
                if remaining_in_open == 0:
                    # Se ficou vazia, pode ser deletada ou mantida aberta para futuras peças
                    # Vamos manter aberta para futuras peças
                    pass
        else:
            # Não existe caixa aberta: reabre a caixa fechada
            box.status = BoxStatus.OPEN
            box.closed_at = None
            session.add(box)
    
    session.commit()
    return result

