from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler,OneHotEncoder

from src.config import (NUMERIC_FEATURES,CATEGORICAL_FEATURES)

def build_preprocessor():
    numeric_transformer  = Pipeline(
        steps=[
            ("imputer",SimpleImputer(strategy="median")),
            ("scaler",StandardScaler())
        ]
    )
    categorical_transformer = Pipeline(
        steps = [
            ("imputer",SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore"))
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num",numeric_transformer,NUMERIC_FEATURES),
            ("cat",categorical_transformer,CATEGORICAL_FEATURES)
        ]
    )
    return preprocessor