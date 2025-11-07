from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.api.deps import get_db_session
from app.schemas.report import FinalReportResponse
from app.services.report_service import generate_final_report

router = APIRouter(prefix="/reports", tags=["Relatórios"])


@router.get("/final", response_model=FinalReportResponse)
def get_final_report(
    session: Session = Depends(get_db_session)
) -> FinalReportResponse:
    """
    Gera relatório final consolidado com estatísticas de produção.
    
    Retorna:
    - Total de peças aprovadas
    - Total de peças reprovadas
    - Contagem de reprovações por motivo
    - Total de caixas utilizadas (abertas e fechadas)
    """
    return generate_final_report(session)

