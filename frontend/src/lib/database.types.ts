export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      canonical_countries: {
        Row: {
          country_code: string
          country_name: string
          region: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          country_code: string
          country_name: string
          region?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          country_code?: string
          country_name?: string
          region?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      canonical_indicators: {
        Row: {
          indicator_id: number
          indicator_name: string
          description: string | null
          unit: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          indicator_id?: number
          indicator_name: string
          description?: string | null
          unit?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          indicator_id?: number
          indicator_name?: string
          description?: string | null
          unit?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      canonical_timeseries: {
        Row: {
          id: number
          country_code: string
          indicator_id: number
          date_value: string
          value: number
          unit: string | null
          source_url: string | null
          release_date: string | null
          vintage_date: string | null
          ingested_at: string
          content_hash: string
        }
        Insert: {
          id?: number
          country_code: string
          indicator_id: number
          date_value: string
          value: number
          unit?: string | null
          source_url?: string | null
          release_date?: string | null
          vintage_date?: string | null
          ingested_at?: string
          content_hash: string
        }
        Update: {
          id?: number
          country_code?: string
          indicator_id?: number
          date_value?: string
          value?: number
          unit?: string | null
          source_url?: string | null
          release_date?: string | null
          vintage_date?: string | null
          ingested_at?: string
          content_hash?: string
        }
      }
      categories: {
        Row: {
          category_id: number
          category_name: string
          description: string | null
        }
        Insert: {
          category_id?: number
          category_name: string
          description?: string | null
        }
        Update: {
          category_id?: number
          category_name?: string
          description?: string | null
        }
      }
      forecast_results: {
        Row: {
          forecast_id: number
          country_code: string | null
          indicator_id: number | null
          forecast_date: string
          forecast_value: number
          forecast_horizon: string
          model_name: string
          created_at: string
          confidence_interval_lower: number | null
          confidence_interval_upper: number | null
        }
        Insert: {
          forecast_id?: number
          country_code?: string | null
          indicator_id?: number | null
          forecast_date: string
          forecast_value: number
          forecast_horizon: string
          model_name: string
          created_at?: string
          confidence_interval_lower?: number | null
          confidence_interval_upper?: number | null
        }
        Update: {
          forecast_id?: number
          country_code?: string | null
          indicator_id?: number | null
          forecast_date?: string
          forecast_value?: number
          forecast_horizon?: string
          model_name?: string
          created_at?: string
          confidence_interval_lower?: number | null
          confidence_interval_upper?: number | null
        }
      }
      taxonomy_mapping: {
        Row: {
          mapping_id: number
          country_code: string | null
          category_id: number | null
          indicator_id: number | null
          rank: number
          is_primary: boolean | null
          fallback_reason: string | null
          coverage_ratio: number | null
          mapping_date: string
          provenance: Json | null
        }
        Insert: {
          mapping_id?: number
          country_code?: string | null
          category_id?: number | null
          indicator_id?: number | null
          rank: number
          is_primary?: boolean | null
          fallback_reason?: string | null
          coverage_ratio?: number | null
          mapping_date?: string
          provenance?: Json | null
        }
        Update: {
          mapping_id?: number
          country_code?: string | null
          category_id?: number | null
          indicator_id?: number | null
          rank?: number
          is_primary?: boolean | null
          fallback_reason?: string | null
          coverage_ratio?: number | null
          mapping_date?: string
          provenance?: Json | null
        }
      }
      ingestion_log: {
        Row: {
          id: number
          run_id: string | null
          endpoint: string
          status: string
          records_processed: number | null
          error_message: string | null
          started_at: string
          completed_at: string | null
          execution_time_ms: number | null
        }
        Insert: {
          id?: number
          run_id?: string | null
          endpoint: string
          status: string
          records_processed?: number | null
          error_message?: string | null
          started_at?: string
          completed_at?: string | null
          execution_time_ms?: number | null
        }
        Update: {
          id?: number
          run_id?: string | null
          endpoint?: string
          status?: string
          records_processed?: number | null
          error_message?: string | null
          started_at?: string
          completed_at?: string | null
          execution_time_ms?: number | null
        }
      }
      validation_log: {
        Row: {
          log_id: number
          table_name: string
          validation_rule: string
          validation_type: string
          is_valid: boolean
          error_message: string | null
          record_count: number
          validated_at: string
          execution_time_ms: number
        }
        Insert: {
          log_id?: number
          table_name: string
          validation_rule: string
          validation_type: string
          is_valid: boolean
          error_message?: string | null
          record_count: number
          validated_at: string
          execution_time_ms: number
        }
        Update: {
          log_id?: number
          table_name?: string
          validation_rule?: string
          validation_type?: string
          is_valid?: boolean
          error_message?: string | null
          record_count?: number
          validated_at?: string
          execution_time_ms?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}