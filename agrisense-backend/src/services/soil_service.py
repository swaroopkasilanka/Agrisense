import pandas as pd
from src.config import AppSettings as Settings
from src.exceptions.custom_exceptions import (AgrisenseException)
from src.logger import get_logger
logger = get_logger(__name__)
class SoilService:
    def __init__(self,soil_path=Settings.SOIL_PATH):
        self.soil_df = pd.read_csv(soil_path)
        logger.info("Soil Lookup loaded successfully")
    
    def get_soildata(self,state,district):
        result = self.soil_df[
            (
                self.soil_df["State_Name"].str.lower() == state.lower()
            )
            &
            (
                self.soil_df["District_Name"].str.lower() == district.lower()
            )
        ]
        if result.empty:
            raise AgrisenseException(f"Soil data not found for {state} | {district}",status_code=404)
        row = result.iloc[0]
        return {
        "PH": row["PH"],
        "Clay": row["Clay"],
        "Sand": row["Sand"],
        "Silt": row["Silt"],
        "Nitrogen": row["Nitrogen"],
        "SOC": row["SOC"],
        "CEC": row["CEC"]
    }
