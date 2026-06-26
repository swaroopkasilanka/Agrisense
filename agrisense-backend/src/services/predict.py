import json
import joblib
import pandas as pd

from src.config import (AppSettings,FEATURE_COLUMNS)

from src.logger import get_logger
logger = get_logger(__name__)

class CropPredictor:

    def __init__(self):

        self.model = None
        self.mlb = None
        self.metadata = None
        self.load_artifacts()

    def load_artifacts(self):
        model_path = (AppSettings.MODEL_FILE_NAME)
        mlb_path = (AppSettings.MLB_FILE_NAME)
        metadata_path = (AppSettings.METADATA_FILE_NAME)
        self.model = joblib.load(model_path)
        self.mlb = joblib.load(mlb_path)
        with open(metadata_path,"r") as file:
            self.metadata = json.load(file)
        logger.info("Artifacts loaded successfully")

    def prepare_input(self,input_data):
        missing_columns = (set(FEATURE_COLUMNS)- set(input_data.keys()))
        if missing_columns:
            error_message = (f"Missing required fields: "f"{sorted(missing_columns)}")
            logger.error(error_message)
            raise ValueError(error_message)
        df = pd.DataFrame([input_data])
        return df[FEATURE_COLUMNS]
    def predict(self,input_data,top_n=5):
        X = self.prepare_input(input_data)
        classifier = (self.model.named_steps["classifier"]) # type: ignore
        preprocessor = (self.model.named_steps["preprocessor"]) # type: ignore
        X_processed = (preprocessor.transform(X))
        probabilities = [
            estimator.predict_proba(X_processed)[0][1]
            for estimator in classifier.estimators_
        ]
        result_df = pd.DataFrame({
            "Crop":self.mlb.classes_, # type: ignore
            "Probability":probabilities
        })
        result_df = (result_df.sort_values(
            "Probability",ascending=False).head(top_n)
        )
        max_prob = result_df["Probability"].max()
        min_prob = result_df["Probability"].min()

        if max_prob == min_prob:
            result_df["SuitabilityScore"] = 100
        else:
            result_df["SuitabilityScore"] = (
                60
                + (
                    (
                        result_df["Probability"]
                        - min_prob
                    )
                    /
                    (
                        max_prob
                        - min_prob
                    )
                ) * 40
            )
        recommendations = []
        for rank, (_, row) in enumerate(result_df.iterrows(),start=1):
            recommendations.append({
                "rank": rank,
                "crop": row["Crop"],
                "probability": round(
                    float(row["Probability"]) * 100,
                    2
                ),
                "suitability_score": round(
                    float(
                        row["SuitabilityScore"]
                    ),
                    2
                )
            })
        return recommendations

if __name__ == "__main__":
    predictor = CropPredictor()

    # sample = {

    #     "State_Name":
    #         "KARNATAKA",

    #     "District_Name":
    #         "MYSORE",

    #     # "Crop_Year":
    #     #     2025,

    #     "Season":
    #         "Kharif",

    #     "Avg_Temperature":
    #         28.5,

    #     "Avg_Humidity":
    #         74.2,

    #     "Total_Rainfall":
    #         850,

    #     "PH":
    #         6.8,

    #     "Clay":
    #         35,

    #     "Sand":
    #         40,

    #     "Silt":
    #         25,

    #     "Nitrogen":
    #         180,

    #     "SOC":
    #         1.2,

    #     "CEC":
    #         18
    # }

    # result = predictor.predict(
    #     sample,
    #     top_n=5
    # )

    # print(result)