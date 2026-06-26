import joblib
import pandas as pd

from src.config import (
    AppSettings,
    FEATURE_COLUMNS
)
from src.services.predict import CropPredictor


def main():

    predictor = CropPredictor()

    test_df = pd.read_pickle(
        AppSettings.TEST_DATA_PATH
    )

    samples = test_df.sample(
        10,
        random_state=42
    )

    all_predictions_data = []

    for idx, row in samples.iterrows():
        input_data = row[FEATURE_COLUMNS].to_dict()
        actual = row["Crop"]
        prediction = predictor.predict(input_data)
        
        # Extract the recommendations list from the predictor output
        recs_list = prediction
        
        # 2. Structure your print statements into a flat dictionary row
        row_data = {
            "Sample_Index": idx,
            "State": row['State_Name'],
            "District": row['District_Name'],
            "Season": row['Season'],
            "Actual_Crops": actual,
            # Convert the complex recommendations list/dict into a string format for the CSV cell
            "Predicted_Recommendations": str(recs_list),
            # Optional: Extract the top #1 rank crop explicitly for easier filtering/sorting later
            "Top_Predicted_Crop": recs_list[0]['crop'] if recs_list else "None",
            "Top_Crop_Confidence": recs_list[0]['confidence_score'] if recs_list else 0.0
        }
        
        # 3. Append to your master list
        all_predictions_data.append(row_data)

        # Keep your console logs exactly as they were
        print("\n" + "=" * 80)
        print(f"State: {row['State_Name']}")
        print(f"District: {row['District_Name']}")
        print(f"Season: {row['Season']}")
        print(f"Actual Crops: {actual}")
        print(f"Predicted: {recs_list}")


    # 4. Out of the loop: Convert all collected records to ONE DataFrame and save to ONE CSV
    if all_predictions_data:
        final_df = pd.DataFrame(all_predictions_data)
        final_df.to_csv("all_predictions_summary.csv", index=False)
        print(f"\nSuccessfully saved {len(final_df)} records to 'all_predictions_summary.csv'")

if __name__ == "__main__":
    main()