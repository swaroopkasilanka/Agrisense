import pandas as pd
import requests
from src.config import (AppSettings as Settings,STATE_COORDINATES_NEW)
from src.logger import get_logger
from src.exceptions.custom_exceptions import AgrisenseException

logger = get_logger(__name__)

class WeatherService:
    def __init__(self):
        self.weather_lookup = pd.read_csv(Settings.WEATHER_LOOKUP_PATH)
        logger.info(
            "Weather lookup loaded successfully"
        )
    def weatherlookup(self,state_name,season):
        result = self.weather_lookup[
            (
                self.weather_lookup["State_Name"].str.lower()
                == state_name.lower()
            )
            &
            (
                self.weather_lookup["Season"].str.lower()
                == season.lower()
            )
        ]
        if result.empty:
            raise AgrisenseException("Unable to fetch weather data",status_code=503)
        return {
            "Avg_Temperature": float(
                result.iloc[0]["Avg_Temperature"]
            ),
            "Avg_Humidity": float(
                result.iloc[0]["Avg_Humidity"]
            ),
            "Total_Rainfall":float(
                result.iloc[0]["Total_Rainfall"]
            )
        }
    # def get_live_weather(self,state_name):
    #     state_name = state_name.lower()
    #     if state_name not in STATE_COORDINATES_NEW:
    #         raise ValueError(
    #             f"Coordinates not found for {state_name}"
    #     )
    #     lat, lon = STATE_COORDINATES_NEW[state_name]
    #     response = requests.get(
    #         "https://api.open-meteo.com/v1/forecast",
    #         params={
    #             "latitude": lat,
    #             "longitude": lon,
    #             "current": (
    #                 "temperature_2m,"
    #                 "relative_humidity_2m"
    #             )
    #         },
    #         timeout=10
    #     )

    #     response.raise_for_status()

    #     data = response.json()

    #     current = data["current"]

    #     return {
    #         "Avg_Temperature": float(
    #             current["temperature_2m"]
    #         ),
    #         "Avg_Humidity": float(
    #             current["relative_humidity_2m"]
    #         )
    #     }
    def get_weatherdata(self,state_name,season):
        # live_weather = self.get_live_weather(state_name)
        weatherdata = self.weatherlookup(state_name,season)
        return {
            "Avg_Temperature":weatherdata["Avg_Temperature"],
            "Avg_Humidity":weatherdata["Avg_Humidity"],
            "Total_Rainfall":weatherdata["Total_Rainfall"]
        }

# weather_service = WeatherService()

# weather_data = weather_service.get_weather(
#     state_name="Karnataka",
#     season="Kharif"
# )
# print(weather_data)