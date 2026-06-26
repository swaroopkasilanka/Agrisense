from fastapi import (FastAPI,Request)
from contextlib import asynccontextmanager
from src.schemas.request_schema import PredictionRequest
from src.schemas.response_schema import PredictionResponse
from src.services.crop_recommendation_service import CropRecommendationService
from src.exceptions.handlers import (agrisense_exception_handler,generic_exception_handler)
from src.exceptions.custom_exceptions import (AgrisenseException)
from  src.logger import get_logger
logger = get_logger(__name__)
@asynccontextmanager
async def lifespan(app:FastAPI):
    logger.info("Starting the API")
    app.state.crop_service = CropRecommendationService()
    logger.info("Crop Recommendation Service intialized")
    yield
    logger.info("Stopping Agrisense API")

app =FastAPI(title="Agrisense API",version="1.0.0",lifespan=lifespan)
app.add_exception_handler(AgrisenseException,agrisense_exception_handler) # type: ignore
app.add_exception_handler(Exception,generic_exception_handler)

@app.get("/")
def home():
    return {
        "application": "Agrisense Crop Recommendation API",
        "version": "1.0.0",
        "status": "Running"
    }

@app.get("/health")
def health(request: Request):
    service = request.app.state.crop_service
    return {
        "status": "healthy",
        "version": "1.0.0",
        "services": {
            "model_loaded": service.predictor.model is not None,
            "soil_lookup_loaded": service.soil_service.soil_data is not None,
            "weather_lookup_loaded": service.weather_service.weather_lookup is not None
        }
    }
@app.post("/api/v1/recommend-crops,response_model=PredictionResponse")
def recommend_crops(request_body:PredictionRequest,request:Request):
    service = request.app.state.crop_service
    recommendations = (
        service.get_recommendations(
            state_name = request_body.state_name,
            district_name=request_body.district_name,
            season =request_body.season
        )
    )
    return {
    "success": True,
    "message":"Recommendations generated successfully",
    "data": {
        "recommendations":recommendations
    }
}