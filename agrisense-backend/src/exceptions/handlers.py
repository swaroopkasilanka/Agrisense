from fastapi import Request
from fastapi.responses import JSONResponse
from src.exceptions.custom_exceptions import (AgrisenseException)
from src.logger import get_logger

logger = get_logger(__name__)

async def agrisense_exception_handler(request: Request,exc: AgrisenseException):
    logger.error(exc.message)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.message,
            "data": None
        }
    )
async def generic_exception_handler(request: Request,exc: Exception):
    logger.exception(str(exc))
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal Server Error",
            "data": None
        }
    )