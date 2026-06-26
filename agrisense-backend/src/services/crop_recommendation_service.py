from datetime import datetime

from src.services.soil_service import SoilService
from src.services.weather_service import WeatherService
from src.services.predict import CropPredictor

from src.logger import get_logger

logger = get_logger(__name__)

class CropRecommendationService:
    def __init__(self):
        logger.info("Loading prediction model...")
        self.predictor = CropPredictor()
        logger.info("Loading Soil Lookup...")
        self.soil_service = SoilService()
        logger.info("Loading Weather Lookup...")
        self.weather_service = WeatherService()
       
        logger.info("Crop Recommendation Service initialized successfully")
    
    def get_recommendations(self,state_name:str,district_name:str,season:str):
        logger.info(f"Getting recommendations for {state_name} | {district_name} | {season}")

        soil_data = self.soil_service.get_soildata(state=state_name,district=district_name)
        weather_data = self.weather_service.get_weatherdata(state_name=state_name,season=season)
        model_input = {
            "State_Name":state_name.upper(),
            "District_Name":district_name.upper(),
            "Crop_Year":datetime.now().year,
            "Season":season,
            "Avg_Temperature":weather_data["Avg_Temperature"],
            "Avg_Humidity":weather_data["Avg_Humidity"],
            "Total_Rainfall":weather_data["Total_Rainfall"],
            "PH":soil_data["PH"],
            "Clay":soil_data["Clay"],
            "Sand":soil_data["Sand"],
            "Silt":soil_data["Silt"],
            "Nitrogen":soil_data["Nitrogen"],
            "SOC":soil_data["SOC"],
            "CEC":soil_data["CEC"]
        }
        recommendations = self.predictor.predict(model_input)
        if recommendations:
            logger.info(f"Recommendations found: {recommendations}")
        else:
            logger.warning(f"No recommendations found for {state_name} | {district_name} | {season}")
        return recommendations

if __name__ == "__main__":

    service = CropRecommendationService()

    # result = service.get_recommendations(
    #     state_name="Karnataka",
    #     district_name="Mysore",
    #     season="Kharif"
    # )

    # print(result)
