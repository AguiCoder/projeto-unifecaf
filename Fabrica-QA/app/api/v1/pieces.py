from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from app.api.deps import get_db_session
from app.models.piece import Piece
from app.models.enums import PieceStatus
from app.schemas.piece import PieceCreate, PieceResponse, PieceListResponse, PieceDeleteResponse
from app.services.quality_service import evaluate_piece
from app.services.boxing_service import find_or_create_open_box, allocate_piece_to_box, remove_piece_from_box

router = APIRouter(prefix="/pieces", tags=["Peças"])


@router.post("", response_model=PieceResponse, status_code=201)
def create_piece(
    piece_data: PieceCreate,
    session: Session = Depends(get_db_session)
) -> PieceResponse:
    """
    Cadastra uma nova peça e avalia automaticamente sua qualidade.
    
    - Se aprovada: aloca em uma caixa (cria nova se necessário)
    - Se reprovada: armazena os motivos de reprovação
    
    Retorna a peça criada com status e informações de alocação.
    """
    # Verifica se peça já existe
    existing_piece = session.get(Piece, piece_data.id)
    if existing_piece:
        raise HTTPException(
            status_code=400,
            detail=f"Peça com ID '{piece_data.id}' já existe"
        )
    
    # Avalia qualidade
    evaluation = evaluate_piece(piece_data)
    
    # Cria peça
    piece = Piece(
        id=piece_data.id,
        peso=piece_data.peso,
        cor=piece_data.cor,
        comprimento=piece_data.comprimento,
        status=evaluation["status"],
        rejection_reasons=evaluation["rejection_reasons"]
    )
    
    # Adiciona peça ao session primeiro
    session.add(piece)
    session.flush()  # Flush para obter ID se necessário, mas não commita ainda
    
    # Se aprovada, aloca em caixa (allocate_piece_to_box fará o commit)
    if piece.status == PieceStatus.APPROVED:
        box = find_or_create_open_box(session)
        allocate_piece_to_box(session, piece, box)
    else:
        # Se reprovada, apenas commita
        session.commit()
    
    session.refresh(piece)
    
    return PieceResponse.model_validate(piece)


@router.get("", response_model=PieceListResponse)
def list_pieces(
    status: Optional[PieceStatus] = Query(None, description="Filtrar por status"),
    limit: int = Query(100, ge=1, le=1000, description="Limite de resultados"),
    offset: int = Query(0, ge=0, description="Offset para paginação"),
    session: Session = Depends(get_db_session)
) -> PieceListResponse:
    """
    Lista peças cadastradas com filtros opcionais.
    
    - Filtro por status (approved/rejected)
    - Paginação com limit e offset
    """
    statement = select(Piece)
    
    if status:
        statement = statement.where(Piece.status == status)
    
    # Conta total
    count_statement = select(Piece)
    if status:
        count_statement = count_statement.where(Piece.status == status)
    total = len(session.exec(count_statement).all())
    
    # Aplica paginação
    statement = statement.offset(offset).limit(limit).order_by(Piece.created_at.desc())
    pieces = session.exec(statement).all()
    
    return PieceListResponse(
        items=[PieceResponse.model_validate(p) for p in pieces],
        total=total,
        limit=limit,
        offset=offset
    )


@router.get("/{piece_id}", response_model=PieceResponse)
def get_piece(
    piece_id: str,
    session: Session = Depends(get_db_session)
) -> PieceResponse:
    """
    Retorna detalhes de uma peça específica pelo ID.
    """
    piece = session.get(Piece, piece_id)
    if not piece:
        raise HTTPException(
            status_code=404,
            detail=f"Peça com ID '{piece_id}' não encontrada"
        )
    
    return PieceResponse.model_validate(piece)


@router.delete("/{piece_id}", response_model=PieceDeleteResponse, status_code=200)
def delete_piece(
    piece_id: str,
    session: Session = Depends(get_db_session)
) -> PieceDeleteResponse:
    """
    Remove uma peça cadastrada.
    
    - Se reprovada: remove diretamente
    - Se aprovada: remove da caixa e ajusta estado da caixa se necessário
    - Se removida de caixa fechada e restarem < 10 peças:
      - Move peças de caixa aberta para a fechada até completar 10
      - Ou reabre a caixa fechada se não houver caixa aberta
    
    Retorna informações sobre peças movidas entre caixas, se aplicável.
    """
    piece = session.get(Piece, piece_id)
    if not piece:
        raise HTTPException(
            status_code=404,
            detail=f"Peça com ID '{piece_id}' não encontrada"
        )
    
    # Remove da caixa se necessário e obtém informações sobre peças movidas
    move_info = remove_piece_from_box(session, piece)
    
    # Remove peça
    session.delete(piece)
    session.commit()
    
    # Monta resposta
    if move_info["moved_pieces"]:
        message = f"Peça removida com sucesso. {len(move_info['moved_pieces'])} peça(s) foram movidas da caixa {move_info['from_box_id']} para a caixa {move_info['to_box_id']}."
    else:
        message = "Peça removida com sucesso."
    
    return PieceDeleteResponse(
        message=message,
        moved_pieces=move_info["moved_pieces"],
        from_box_id=move_info["from_box_id"],
        to_box_id=move_info["to_box_id"]
    )

