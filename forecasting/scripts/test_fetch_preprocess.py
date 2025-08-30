from fetch_data import fetch_validated_data
from preprocess_data import preprocess_data

def test_pipeline():
    try:
        # Fetch data
        countries, indicators, timeseries = fetch_validated_data()
        assert len(countries) >= 4, "Expected at least 4 countries"
        assert len(indicators) >= 4, "Expected at least 4 indicators"
        assert len(timeseries) >= 100, "Expected at least 100 timeseries records"
        print("Data fetch test passed")

        # Preprocess data
        preprocessed_data = preprocess_data(countries, indicators, timeseries)

        # 🎯 FIX: Calculate expected columns dynamically based on fetched data
        # The expected number of data columns is the product of the number of countries and indicators
        expected_data_columns = len(countries) * len(indicators)

        # The total expected columns is the data columns plus the 'date_value' column
        expected_total_columns = expected_data_columns + 1

        # Assertions to check for data integrity and structure
        assert not preprocessed_data.empty, "Preprocessed data is empty"
        assert 'date_value' in preprocessed_data.columns, "Missing date_value column"
        assert len(preprocessed_data.columns) >= expected_total_columns, f"Expected at least {expected_total_columns} columns, but found {len(preprocessed_data.columns)}"
        print("Preprocessing test passed")

    except Exception as e:
        print(f"Test failed: {str(e)}")
        raise

if __name__ == "__main__":
    test_pipeline()