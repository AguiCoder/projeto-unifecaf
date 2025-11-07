from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from app.api.deps import get_db_session
from app.models.box import Box
from app.models.piece import Piece
from app.models.enums import BoxStatus, PieceStatus
from app.schemas.box import BoxResponse, BoxDetailResponse, BoxListResponse

router = APIRouter(prefix="/boxes", tags=["Caixas"])


@router.get("", response_model=BoxListResponse)
def list_boxes(
    status: Optional[BoxStatus] = Query(None, description="Filtrar por status (open/closed)"),
    session: Session = Depends(get_db_session)
) -> BoxListResponse:
    """
    Lista caixas cadastradas.
    
    - Filtro opcional por status (open/closed)
    - Por padrão, lista todas as caixas
    """
    statement = select(Box)
    
    if status:
        statement = statement.where(Box.status == status)
    
    boxes = session.exec(statement.order_by(Box.opened_at.desc())).all()
    
    # Calcula piece_count para cada caixa
    box_responses = []
    for box in boxes:
        piece_count_statement = select(Piece).where(
            Piece.box_id == box.id,
            Piece.status == PieceStatus.APPROVED
        )
        pieces = session.exec(piece_count_statement).all()
        piece_count = len(pieces)
        
        box_responses.append(BoxResponse(
            id=box.id,
            status=box.status,
            opened_at=box.opened_at,
            closed_at=box.closed_at,
            piece_count=piece_count
        ))
    
    return BoxListResponse(
        items=box_responses,
        total=len(box_responses)
    )


@router.get("/{box_id}", response_model=BoxDetailResponse)
def get_box(
    box_id: int,
    session: Session = Depends(get_db_session)
) -> BoxDetailResponse:
    """
    Retorna detalhes de uma caixa específica com lista de peças.
    """
    box = session.get(Box, box_id)
    if not box:
        raise HTTPException(
            status_code=404,
            detail=f"Caixa com ID '{box_id}' não encontrada"
        )
    
    # Busca peças da caixa
    statement = select(Piece).where(
        Piece.box_id == box.id,
        Piece.status == PieceStatus.APPROVED
    )
    pieces = session.exec(statement.order_by(Piece.created_at)).all()
    
    from app.schemas.piece import PieceResponse
    
    return BoxDetailResponse(
        id=box.id,
        status=box.status,
        opened_at=box.opened_at,
        closed_at=box.closed_at,
        piece_count=len(pieces),
        pieces=[PieceResponse.model_validate(p) for p in pieces]
    )

