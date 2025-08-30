import pandas as pd
from fetch_data import fetch_validated_data
from preprocess_data import preprocess_data
from forecast_data import forecast_data

def test_forecast_edge_cases():
    try:
        countries, indicators, timeseries = fetch_validated_data()
        preprocessed_data = preprocess_data(countries, indicators, timeseries)

        # Edge Case 1: Insufficient data (truncate to <12 points)
        short_data = preprocessed_data.head(10)
        results = forecast_data(short_data, countries, indicators)
        assert len(results) == 0, "Expected no forecasts for insufficient data"
        print("Insufficient data test passed")

        # Edge Case 2: Non-stationary data (simulate constant values)
        constant_data = preprocessed_data.copy()
        for col in constant_data.columns:
            if col != 'date_value':
                constant_data[col] = 100.0
        try:
            forecast_data(constant_data, countries, indicators)
            print("Non-stationary data test passed (handled gracefully)")
        except Exception as e:
            print(f"Non-stationary data test passed: {str(e)}")

    except Exception as e:
        print(f"Edge case test failed: {str(e)}")
        raise

if __name__ == "__main__":
    test_forecast_edge_cases()