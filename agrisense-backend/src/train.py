import json
import pandas as pd
from datetime import datetime
from sklearn.pipeline import Pipeline
from sklearn.multiclass import OneVsRestClassifier
from sklearn.preprocessing import MultiLabelBinarizer
from lightgbm import LGBMClassifier
from src.config import (
    AppSettings,
    FEATURE_COLUMNS,
    TARGET_COLUMN,
    MODEL_PARAMS
)
from src.logger import get_logger
from src.utils import (
    Create_directories,
    save_model,
    save_mlb,
    save_metadata,
    save_metrics
)
from src.preprocessing import (build_preprocessor)
from src.evaluation import (evaluate_model)

logger = get_logger(__name__)

def load_datasets():
    logger.info("Loading train and test datasets")
    print(AppSettings.TRAIN_DATA_PATH)
    train_df = pd.read_pickle( AppSettings.TRAIN_DATA_PATH)
    test_df = pd.read_pickle(AppSettings.TEST_DATA_PATH)
    logger.info(f"Train shape: {train_df.shape}" )
    logger.info(f"Test shape: {test_df.shape}")
    return train_df, test_df

def prepare_data(train_df,test_df):
    logger.info("Preparing training data")
    X_train = train_df[FEATURE_COLUMNS]
    X_test = test_df[FEATURE_COLUMNS]
    mlb = MultiLabelBinarizer()
    Y_train = mlb.fit_transform(train_df[TARGET_COLUMN])
    Y_test = mlb.transform(test_df[TARGET_COLUMN])
    logger.info( f"Number of crops: {len(mlb.classes_)}")
    return (
        X_train,
        X_test,
        Y_train,
        Y_test,
        mlb
    )
def build_pipeline():
    pipeline = Pipeline(
        steps=[
            ("preprocessor",build_preprocessor() ),
            ("classifier",
                OneVsRestClassifier(
                    LGBMClassifier( **MODEL_PARAMS) # type: ignore
                )
            )
        ]
    )
    return pipeline

def build_metadata( mlb, metrics):
    metadata = {
        "model_version":AppSettings.MODEL_VERSION,
        "training_date": datetime.now().strftime( "%Y-%m-%d %H:%M:%S"),
        "feature_columns": FEATURE_COLUMNS,
        "target_column":TARGET_COLUMN,
        "number_of_crops":len(mlb.classes_),
        "crop_classes": mlb.classes_.tolist(),
        "metrics":metrics
    }
    return metadata
def main():
    try:
        Create_directories()
        logger.info("Model training started" )
        train_df, test_df = (load_datasets())
        (
            X_train,
            X_test,
            Y_train,
            Y_test,
            mlb
        ) = prepare_data(
            train_df,
            test_df
        )
        pipeline = build_pipeline()
        logger.info("Training model")
        pipeline.fit(X_train,Y_train) # type: ignore
        logger.info("Training completed")
        metrics = evaluate_model(pipeline, X_test,Y_test)
        logger.info(f"Metrics: {metrics}")
        model_path = save_model(pipeline)
        logger.info(f"Model saved: {model_path}")
        save_mlb(mlb)
        save_metrics(metrics)
        metadata = build_metadata(mlb,metrics)
        save_metadata( metadata)
        logger.info("Artifacts saved successfully")
        logger.info("Training pipeline completed")
    except Exception as ex:
        logger.exception(f"Training failed: {ex}")
        raise

if __name__ == "__main__":
    main()