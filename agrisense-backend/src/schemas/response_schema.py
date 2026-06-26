from pydantic import BaseModel

class CropRecommendation(BaseModel):
    rank: int
    crop: str
    probability: float
    suitability_score: float

class PredictionResponse(BaseModel):
    recommendations: list[CropRecommendation]