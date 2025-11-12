from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from app.api.deps import get_db_session
from app.models.box import Box
from app.models.piece import Piece
from app.models.enums import BoxStatus, PieceStatus
from app.schemas.box import BoxResponse, BoxDetailResponse, BoxListResponse, BoxDeleteResponse, ReallocatedPieceInfo
from app.services.boxing_service import reallocate_pieces_from_box

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


@router.delete("/{box_id}", response_model=BoxDeleteResponse, status_code=200)
def delete_box(
    box_id: int,
    session: Session = Depends(get_db_session)
) -> BoxDeleteResponse:
    """
    Exclui uma caixa cadastrada.
    
    - Se a caixa tiver peças, elas serão realocadas automaticamente:
      - Peças são movidas para caixa aberta existente (ou nova caixa criada)
      - Cada caixa é preenchida até 10 peças
      - Novas caixas são criadas conforme necessário
    - Se a caixa estiver vazia, é excluída diretamente
    
    Retorna informações sobre peças realocadas e caixas criadas.
    """
    box = session.get(Box, box_id)
    if not box:
        raise HTTPException(
            status_code=404,
            detail=f"Caixa com ID '{box_id}' não encontrada"
        )
    
    # Realoca peças da caixa antes de excluir
    reallocation_info = reallocate_pieces_from_box(session, box)
    
    # Exclui a caixa
    session.delete(box)
    session.commit()
    
    # Monta resposta
    if reallocation_info["reallocated_pieces"]:
        piece_count = len(reallocation_info["reallocated_pieces"])
        boxes_created = reallocation_info["boxes_created"]
        
        if boxes_created > 0:
            message = f"Caixa excluída com sucesso. {piece_count} peça(s) foram realocadas para {boxes_created} nova(s) caixa(s)."
        else:
            message = f"Caixa excluída com sucesso. {piece_count} peça(s) foram realocadas para caixa(s) existente(s)."
    else:
        message = "Caixa excluída com sucesso."
    
    # Converte reallocated_pieces para ReallocatedPieceInfo
    reallocated_pieces = [
        ReallocatedPieceInfo(
            piece_id=item["piece_id"],
            from_box_id=item["from_box_id"],
            to_box_id=item["to_box_id"]
        )
        for item in reallocation_info["reallocated_pieces"]
    ]
    
    return BoxDeleteResponse(
        message=message,
        reallocated_pieces=reallocated_pieces,
        boxes_created=reallocation_info["boxes_created"]
    )

