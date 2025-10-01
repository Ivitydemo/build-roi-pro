export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      builder_profiles: {
        Row: {
          branding_color: string | null
          company_logo_url: string | null
          company_name: string
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string | null
          default_heloc_rate: number | null
          default_refinance_rate: number | null
          id: string
          service_areas: string[] | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          branding_color?: string | null
          company_logo_url?: string | null
          company_name: string
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string | null
          default_heloc_rate?: number | null
          default_refinance_rate?: number | null
          id?: string
          service_areas?: string[] | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          branding_color?: string | null
          company_logo_url?: string | null
          company_name?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string | null
          default_heloc_rate?: number | null
          default_refinance_rate?: number | null
          id?: string
          service_areas?: string[] | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      comparable_sales: {
        Row: {
          address: string
          created_at: string | null
          data_source: string | null
          distance_miles: number | null
          id: string
          price_per_sqft: number | null
          property_id: string | null
          sale_date: string | null
          sale_price: number
          square_footage: number | null
        }
        Insert: {
          address: string
          created_at?: string | null
          data_source?: string | null
          distance_miles?: number | null
          id?: string
          price_per_sqft?: number | null
          property_id?: string | null
          sale_date?: string | null
          sale_price: number
          square_footage?: number | null
        }
        Update: {
          address?: string
          created_at?: string | null
          data_source?: string | null
          distance_miles?: number | null
          id?: string
          price_per_sqft?: number | null
          property_id?: string | null
          sale_date?: string | null
          sale_price?: number
          square_footage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comparable_sales_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_library: {
        Row: {
          builder_id: string
          id: string
          photo_type: string | null
          photo_url: string
          project_name: string | null
          room_type: string | null
          tags: string[] | null
          uploaded_at: string | null
        }
        Insert: {
          builder_id: string
          id?: string
          photo_type?: string | null
          photo_url: string
          project_name?: string | null
          room_type?: string | null
          tags?: string[] | null
          uploaded_at?: string | null
        }
        Update: {
          builder_id?: string
          id?: string
          photo_type?: string | null
          photo_url?: string
          project_name?: string | null
          room_type?: string | null
          tags?: string[] | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photo_library_builder_id_fkey"
            columns: ["builder_id"]
            isOneToOne: false
            referencedRelation: "builder_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          bathrooms: number | null
          bedrooms: number | null
          builder_id: string
          city: string | null
          created_at: string | null
          current_value: number | null
          id: string
          square_footage: number | null
          state: string | null
          updated_at: string | null
          year_built: number | null
          zillow_data: Json | null
          zip_code: string | null
        }
        Insert: {
          address: string
          bathrooms?: number | null
          bedrooms?: number | null
          builder_id: string
          city?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          square_footage?: number | null
          state?: string | null
          updated_at?: string | null
          year_built?: number | null
          zillow_data?: Json | null
          zip_code?: string | null
        }
        Update: {
          address?: string
          bathrooms?: number | null
          bedrooms?: number | null
          builder_id?: string
          city?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          square_footage?: number | null
          state?: string | null
          updated_at?: string | null
          year_built?: number | null
          zillow_data?: Json | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_builder_id_fkey"
            columns: ["builder_id"]
            isOneToOne: false
            referencedRelation: "builder_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      remodel_packages: {
        Row: {
          base_price: number
          builder_id: string
          created_at: string | null
          id: string
          included_items: string[] | null
          is_active: boolean | null
          package_description: string | null
          package_name: string
          package_order: number | null
          price_per_sqft: number | null
          updated_at: string | null
        }
        Insert: {
          base_price: number
          builder_id: string
          created_at?: string | null
          id?: string
          included_items?: string[] | null
          is_active?: boolean | null
          package_description?: string | null
          package_name: string
          package_order?: number | null
          price_per_sqft?: number | null
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          builder_id?: string
          created_at?: string | null
          id?: string
          included_items?: string[] | null
          is_active?: boolean | null
          package_description?: string | null
          package_name?: string
          package_order?: number | null
          price_per_sqft?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "remodel_packages_builder_id_fkey"
            columns: ["builder_id"]
            isOneToOne: false
            referencedRelation: "builder_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          builder_id: string
          created_at: string | null
          excel_url: string | null
          id: string
          pdf_url: string | null
          property_id: string | null
          report_data: Json
          share_token: string | null
          view_count: number | null
        }
        Insert: {
          builder_id: string
          created_at?: string | null
          excel_url?: string | null
          id?: string
          pdf_url?: string | null
          property_id?: string | null
          report_data: Json
          share_token?: string | null
          view_count?: number | null
        }
        Update: {
          builder_id?: string
          created_at?: string | null
          excel_url?: string | null
          id?: string
          pdf_url?: string | null
          property_id?: string | null
          report_data?: Json
          share_token?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_builder_id_fkey"
            columns: ["builder_id"]
            isOneToOne: false
            referencedRelation: "builder_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
