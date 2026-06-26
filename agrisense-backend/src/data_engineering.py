import pandas as pd

from src.logger import get_logger
from src.utils import Create_directories
from src.config import (
    AppSettings,
    TARGET_COLUMN,
    DROP_COLUMNS,
    VALID_CROPS
)

logger = get_logger(__name__)

def load_data():
    logger.info(
        f"Loading data from: {AppSettings.RAW_DATA_PATH}"
    )
    df = pd.read_csv(
        AppSettings.RAW_DATA_PATH
    )
    logger.info(
        f"Raw dataset shape: {df.shape}"
    )
    return df

def filter_valid_crops(df):
    logger.info(
        "Filtering valid crops"
    )
    df = df[
        df[TARGET_COLUMN].isin(
            VALID_CROPS
        )
    ].copy()
    logger.info(
        f"Dataset shape after crop filtering: {df.shape}"
    )
    return df

def drop_columns(df):
    columns_to_drop = [
        col
        for col in DROP_COLUMNS
        if col in df.columns
    ]
    df = df.drop(
        columns=columns_to_drop
    )
    logger.info(
        f"Dataset shape after dropping columns: {df.shape}"
    )
    return df
def create_multilabel_dataset(df):
    logger.info(
        "Creating multilabel dataset"
    )
    group_columns = [
        "State_Name",
        "District_Name",
        "Crop_Year",
        "Season",
        "Avg_Temperature",
        "Avg_Humidity",
        "Total_Rainfall",
        "PH",
        "Clay",
        "Sand",
        "Silt",
        "Nitrogen",
        "SOC",
        "CEC"
    ]
    multilabel_df = (
        df.groupby(
            group_columns,
            dropna=False
        )[TARGET_COLUMN]
        .apply(
            lambda x:
            sorted(
                list(
                    set(x)
                )
            )
        )
        .reset_index()
    )
    logger.info(
        f"Multilabel dataset shape: {multilabel_df.shape}"
    )
    return multilabel_df

def split_dataset(df):
    logger.info(
        "Creating train/test split"
    )
    train_valid_df = df[
        df["Crop_Year"] <= 2017
    ].copy()
    test_df = df[
        df["Crop_Year"] >= 2018
    ].copy()
    logger.info(
        f"Train shape: {train_valid_df.shape}"
    )
    logger.info(
        f"Test shape: {test_df.shape}"
    )
    weather_lookup = (
        df.groupby(
            ["State_Name", "Season"]
        )[
            [
                "Avg_Temperature",
                "Avg_Humidity",
                "Total_Rainfall"
            ]
        ]
        .mean()
        .reset_index()
    )
    return train_valid_df, test_df,weather_lookup

def save_datasets(train_valid_df,test_df,weather_lookup):
    train_path = (AppSettings.DATA_DIR /"train_valid.pkl")
    test_path = (AppSettings.DATA_DIR /"test.pkl")
    train_valid_df.to_pickle(train_path)
    test_df.to_pickle(test_path)
    weather_lookup.to_csv(
   AppSettings.DATA_DIR /"weather_lookup.csv",
    index=False
    )
    logger.info(
        f"Train data saved to {train_path}"
    )
    logger.info(
        f"Test data saved to {test_path}"
    )

def main():
    try:
        Create_directories()
        logger.info(
            "Data engineering started"
        )
        df = load_data()
        df = filter_valid_crops(df)
        df = drop_columns(df)
        multilabel_df = (
            create_multilabel_dataset(df)
        )
        train_valid_df, test_df,weather_lookup = (
            split_dataset(multilabel_df)
        )
        save_datasets(
            train_valid_df,
            test_df,
            weather_lookup
        )
        logger.info(
            "Data engineering completed successfully"
        )
    except Exception as ex:
        logger.exception(
            f"Data engineering failed: {ex}"
        )
        raise

if __name__ == "__main__":
    main()