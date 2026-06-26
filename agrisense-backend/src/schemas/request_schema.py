from pydantic import (BaseModel,field_validator)

class PredictionRequest(BaseModel):
    state_name: str
    district_name: str
    season: str

    @field_validator("season")
    @classmethod
    def validate_season(cls,value):
        allowed = [
                    "Kharif",
                    "Rabi",
                    "Summer",
                    "Whole Year"
                ]
        if value not in allowed:
            raise ValueError(f"Season must be one of {allowed}")
        return value       
