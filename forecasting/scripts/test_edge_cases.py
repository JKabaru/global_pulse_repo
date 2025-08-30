import pandas as pd
from fetch_data import fetch_validated_data
from preprocess_data import preprocess_data

def test_edge_cases():
    try:
        # Fetch data
        countries, indicators, timeseries = fetch_validated_data()

        # Edge Case 1: Empty timeseries
        empty_timeseries = timeseries.head(0)
        try:
            preprocess_data(countries, indicators, empty_timeseries)
            assert False, "Expected preprocessing to fail with empty timeseries"
        except Exception as e:
            print(f"Empty timeseries test passed: {str(e)}")

        # Edge Case 2: Missing indicator_name
        invalid_indicators = indicators.copy()
        invalid_indicators.loc[invalid_indicators.index[0], 'indicator_name'] = None
        try:
            preprocess_data(countries, invalid_indicators, timeseries)
            assert False, "Expected preprocessing to fail with null indicator_name"
        except Exception as e:
            print(f"Null indicator_name test passed: {str(e)}")

        # Edge Case 3: Sparse data (subset of timeseries)
        sparse_timeseries = timeseries[timeseries['country_code'] == countries['country_code'].iloc[0]]
        preprocessed_data = preprocess_data(countries, indicators, sparse_timeseries)
        expected_columns = len(countries) * len(indicators) + 1
        assert len(preprocessed_data.columns) == expected_columns, f"Expected {expected_columns} columns, found {len(preprocessed_data.columns)}"
        print("Sparse data test passed")

    except Exception as e:
        print(f"Edge case test failed: {str(e)}")
        raise

if __name__ == "__main__":
    test_edge_cases()
