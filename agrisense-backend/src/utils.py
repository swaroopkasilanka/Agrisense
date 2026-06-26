from src.config import AppSettings as Settings
from src.logger import get_logger
import json
import joblib

logger = get_logger(__name__)
def Create_directories():
    directories = [
        Settings.ARTIFACT_DIR,
        Settings.MODEL_DIR,
        Settings.ENCODER_DIR,
        Settings.METADATA_DIR,
        Settings.LOG_DIR,
        Settings.METRICS_DIR
    ]
    for directory in directories:
        directory.mkdir(
            parents=True,
            exist_ok=True
        )
    logger.info(f"Directory verified: {Settings.LOG_DIR}")

def save_model(model):
    model_path = (Settings.MODEL_FILE_NAME)
    joblib.dump(model,model_path)
    return model_path

def save_mlb(mlb):
    mlb_path = (Settings.MLB_FILE_NAME)
    joblib.dump( mlb, mlb_path
    )
    return mlb_path
def save_metadata(metadata):
    metadata_path = (Settings.METADATA_FILE_NAME)
    with open(
        metadata_path,"w",encoding="utf-8"
    ) as file:
        json.dump(metadata,file,indent=4)
    return metadata_path
def save_metrics(metrics):
    metrics_path = (Settings.METRICS_FILE_NAME)
    with open(
        metrics_path,"w",encoding="utf-8"
    ) as file:
        json.dump(metrics,file,indent=4)
    return metrics_path