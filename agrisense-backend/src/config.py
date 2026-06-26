import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

class AppSettings:
    #Application paths
    BASE_DIR = Path(__file__).resolve().parent.parent
    DATA_DIR = BASE_DIR / "Data"
    ARTIFACT_DIR = BASE_DIR / "artifacts"
    MODEL_DIR = ARTIFACT_DIR / "model"
    ENCODER_DIR = ARTIFACT_DIR / "encoders"
    METADATA_DIR = ARTIFACT_DIR / "metadata"
    METRICS_DIR = ARTIFACT_DIR/ "metrics"
    LOG_DIR = BASE_DIR / "logs"

    TRAIN_DATA_PATH = DATA_DIR/os.getenv("TRAIN_DATA_PATH",str("train_valid.pkl"))
    TEST_DATA_PATH = DATA_DIR/os.getenv("TEST_DATA_PATH",str("test.pkl"))

    MODEL_FILE_NAME = MODEL_DIR/os.getenv("MODEL_FILE_NAME","lightgbm_crop_model.pkl")
    MLB_FILE_NAME = ENCODER_DIR/os.getenv("MLB_FILE_NAME","mlb.pkl")
    METADATA_FILE_NAME = METADATA_DIR/os.getenv("METADATA_FILE_NAME","metadata.json")
    METRICS_FILE_NAME =METRICS_DIR/ os.getenv("METRICS_FILE_NAME","model_metrics.json")

    LOG_LEVEL = os.getenv("LOG_LEVEL","INFO")
    LOG_FILE_NAME = os.getenv("LOG_FILE_NAME","agrisense.log")

    RANDOM_STATE = int(os.getenv("RANDOM_STATE", 42))
    MODEL_VERSION = os.getenv( "MODEL_VERSION","1.0.0")
    RAW_DATA_PATH = DATA_DIR/os.getenv("RAW_DATA_FILE",str("crop_weather_soil.csv"))
    SOIL_PATH = DATA_DIR/os.getenv("SOIL_FILE",str("india_district_soil_profile.csv"))
    WEATHER_LOOKUP_PATH = DATA_DIR/os.getenv("WEATHER_LOOKUP_FILE",str("weather_lookup.csv"))
    WEATHER_API_KEY = os.getenv("WEATHER_API_KEY","")
    WEATHER_API_TIMEOUT = int( os.getenv( "WEATHER_API_TIMEOUT",30))
    
FEATURE_COLUMNS = [
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

NUMERIC_FEATURES = [
    "Crop_Year",
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

CATEGORICAL_FEATURES = [
    "State_Name",
    "District_Name",
    "Season"
]
TARGET_COLUMN = "Crop"

DROP_COLUMNS = [
    "Area",
    "Production",
    "yield",
    "merge_key_x",
    "merge_key_y"
]

VALID_CROPS = [
    'Arecanut',
    'Arhar/Tur',
    'Bajra',
    'Banana',
    'Barley',
    'Beans & Mutter(Vegetable)',
    'Bhindi',
    'Black pepper',
    'Brinjal',
    'Cabbage',
    'Cardamom',
    'Cashewnut',
    'Castor seed',
    'Cauliflower',
    'Citrus Fruit',
    'Coconut',
    'Coriander',
    'Cotton(lint)',
    'Cowpea(Lobia)',
    'Drum Stick',
    'Dry chillies',
    'Dry ginger',
    'Garlic',
    'Ginger',
    'Gram',
    'Grapes',
    'Groundnut',
    'Guar seed',
    'Horse-gram',
    'Jowar',
    'Jute',
    'Khesari',
    'Korra',
    'Linseed',
    'Maize',
    'Mango',
    'Masoor',
    'Mesta',
    'Moong(Green Gram)',
    'Moth',
    'Niger seed',
    'Onion',
    'Orange',
    'Paddy',
    'Papaya',
    'Peas & beans (Pulses)',
    'Pineapple',
    'Pome Fruit',
    'Potato',
    'Ragi',
    'Rapeseed &Mustard',
    'Rice',
    'Safflower',
    'Sannhamp',
    'Sesamum',
    'Small millets',
    'Soyabean',
    'Sugarcane',
    'Sunflower',
    'Sweet potato',
    'Tapioca',
    'Tobacco',
    'Tomato',
    'Turmeric',
    'Urad',
    'Wheat'
]
MODEL_PARAMS = {
    "n_estimators": 700,
    "learning_rate": 0.03,
    "num_leaves": 127,
    "max_depth": -1,
    "subsample": 0.8,
    "colsample_bytree": 0.9,
    "min_child_samples": 20,
    "random_state": AppSettings.RANDOM_STATE,
    "verbose": -1,
    "n_jobs": -1
}
STATE_COORDINATES = {
    "Andaman and Nicobar Islands": (11.7401, 92.6586),
    "Andhra Pradesh": (15.9129, 79.7400),
    "Arunachal Pradesh": (28.2180, 94.7278),
    "Assam": (26.2006, 92.9376),
    "Bihar": (25.0961, 85.3131),
    "Chandigarh": (30.7333, 76.7794),
    "Chhattisgarh": (21.2787, 81.8661),
    "Dadra and Nagar Haveli": (20.1809, 73.0169),
    "Daman and Diu": (20.4283, 72.8397),
    "Delhi": (28.7041, 77.1025),
    "Goa": (15.2993, 74.1240),
    "Gujarat": (22.2587, 71.1924),
    "Haryana": (29.0588, 76.0856),
    "Himachal Pradesh": (31.1048, 77.1734),
    "Jammu and Kashmir": (33.7782, 76.5762),
    "Jharkhand": (23.6102, 85.2799),
    "Karnataka": (15.3173, 75.7139),
    "Kerala": (10.8505, 76.2711),
    "Laddakh": (34.1526, 77.5771),
    "Madhya Pradesh": (22.9734, 78.6569),
    "Maharashtra": (19.7515, 75.7139),
    "Manipur": (24.6637, 93.9063),
    "Meghalaya": (25.4670, 91.3662),
    "Mizoram": (23.1645, 92.9376),
    "Nagaland": (26.1584, 94.5624),
    "Odisha": (20.9517, 85.0985),
    "Puducherry": (11.9416, 79.8083),
    "Punjab": (31.1471, 75.3412),
    "Rajasthan": (27.0238, 74.2179),
    "Sikkim": (27.5330, 88.5122),
    "Tamil Nadu": (11.1271, 78.6569),
    "Telangana": (18.1124, 79.0193),
    "Tripura": (23.9408, 91.9882),
    "Uttar Pradesh": (26.8467, 80.9462),
    "Uttarakhand": (30.0668, 79.0193),
    "West Bengal": (22.9868, 87.8550)
}
STATE_COORDINATES_NEW = {state.lower(): coords for state, coords in STATE_COORDINATES.items()}