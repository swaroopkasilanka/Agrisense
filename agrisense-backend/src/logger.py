import logging
from logging.handlers import TimedRotatingFileHandler
from src.config import AppSettings as Settings

def get_logger(name):

    Settings.LOG_DIR.mkdir(
        parents=True,
        exist_ok=True
    )
    logger = logging.getLogger(name)
    logger.propagate = False
    if logger.handlers:
        return logger

    logger.setLevel(
        getattr(logging, Settings.LOG_LEVEL.upper())
    )

    log_file = (
        Settings.LOG_DIR /
        Settings.LOG_FILE_NAME
    )

    handler = TimedRotatingFileHandler(
        filename=log_file,
        when="midnight",
        interval=1,
        backupCount=30,
        encoding="utf-8"
    )

    handler.suffix = "%Y-%m-%d"

    formatter = logging.Formatter(
        "%(asctime)s | "
        "%(levelname)s | "
        "%(name)s | "
        "%(funcName)s | "
        "%(message)s"
    )

    handler.setFormatter(
        formatter
    )

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(
        formatter
    )

    logger.addHandler(handler)
    logger.addHandler(console_handler)

    return logger