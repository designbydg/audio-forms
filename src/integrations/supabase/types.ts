export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          created_at: string | null
          id: string
          options: Json | null
          order_index: number
          question_text: string
          question_type: string
          required: boolean | null
          survey_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          options?: Json | null
          order_index: number
          question_text: string
          question_type: string
          required?: boolean | null
          survey_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          options?: Json | null
          order_index?: number
          question_text?: string
          question_type?: string
          required?: boolean | null
          survey_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      responses: {
        Row: {
          created_at: string | null
          id: string
          response_data: Json | null
          survey_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          response_data?: Json | null
          survey_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          response_data?: Json | null
          survey_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_analytics: {
        Row: {
          avg_completion_time: unknown | null
          created_at: string | null
          id: string
          starts: number | null
          submissions: number | null
          survey_id: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          avg_completion_time?: unknown | null
          created_at?: string | null
          id?: string
          starts?: number | null
          submissions?: number | null
          survey_id: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          avg_completion_time?: unknown | null
          created_at?: string | null
          id?: string
          starts?: number | null
          submissions?: number | null
          survey_id?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "survey_analytics_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: true
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_analytics_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          survey_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          survey_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          survey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_analytics_events_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_design: {
        Row: {
          button_background: string | null
          button_text: string | null
          created_at: string | null
          font_family: string | null
          id: string
          logo_url: string | null
          organization_name: string | null
          survey_id: string
          text_color: string | null
          updated_at: string | null
        }
        Insert: {
          button_background?: string | null
          button_text?: string | null
          created_at?: string | null
          font_family?: string | null
          id?: string
          logo_url?: string | null
          organization_name?: string | null
          survey_id: string
          text_color?: string | null
          updated_at?: string | null
        }
        Update: {
          button_background?: string | null
          button_text?: string | null
          created_at?: string | null
          font_family?: string | null
          id?: string
          logo_url?: string | null
          organization_name?: string | null
          survey_id?: string
          text_color?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "survey_design_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: true
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_start_times: {
        Row: {
          created_at: string | null
          id: string
          start_time: string | null
          survey_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          start_time?: string | null
          survey_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          start_time?: string | null
          survey_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "survey_start_times_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          created_at: string | null
          has_reached_limit: boolean | null
          id: string
          status: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          has_reached_limit?: boolean | null
          id?: string
          status: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          has_reached_limit?: boolean | null
          id?: string
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transcriptions: {
        Row: {
          audio_path: string
          created_at: string | null
          id: string
          response_id: string
          transcription: string | null
          updated_at: string | null
        }
        Insert: {
          audio_path: string
          created_at?: string | null
          id?: string
          response_id: string
          transcription?: string | null
          updated_at?: string | null
        }
        Update: {
          audio_path?: string
          created_at?: string | null
          id?: string
          response_id?: string
          transcription?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transcriptions_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "responses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      duplicate_survey: {
        Args: {
          original_survey_id: string
          p_user_id: string
        }
        Returns: string
      }
      initialize_survey_analytics: {
        Args: {
          p_survey_id: string
        }
        Returns: undefined
      }
      update_survey_analytics: {
        Args: {
          p_survey_id: string
          p_action: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
