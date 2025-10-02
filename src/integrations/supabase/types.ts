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
      crm_integrations: {
        Row: {
          builder_id: string
          created_at: string
          crm_name: string | null
          id: string
          is_active: boolean | null
          last_used_at: string | null
          updated_at: string
          webhook_url: string
        }
        Insert: {
          builder_id: string
          created_at?: string
          crm_name?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          updated_at?: string
          webhook_url: string
        }
        Update: {
          builder_id?: string
          created_at?: string
          crm_name?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          updated_at?: string
          webhook_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_builder"
            columns: ["builder_id"]
            isOneToOne: false
            referencedRelation: "builder_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_commissions: {
        Row: {
          commission_amount: number
          commission_type: string
          created_at: string
          id: string
          lead_id: string | null
          notes: string | null
          paid_at: string | null
          partner_id: string
          payment_method: string | null
          payment_reference: string | null
          status: string
          updated_at: string
        }
        Insert: {
          commission_amount: number
          commission_type: string
          created_at?: string
          id?: string
          lead_id?: string | null
          notes?: string | null
          paid_at?: string | null
          partner_id: string
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          commission_amount?: number
          commission_type?: string
          created_at?: string
          id?: string
          lead_id?: string | null
          notes?: string | null
          paid_at?: string | null
          partner_id?: string
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_commissions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "partner_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_commissions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_leads: {
        Row: {
          builder_id: string | null
          commission_amount: number | null
          commission_paid: boolean | null
          commission_paid_at: string | null
          conversion_value: number | null
          converted_at: string | null
          created_at: string
          estimated_project_value: number | null
          homeowner_email: string | null
          homeowner_name: string | null
          homeowner_phone: string | null
          id: string
          lead_source: string
          lead_type: string
          notes: string | null
          partner_id: string
          property_address: string | null
          property_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          builder_id?: string | null
          commission_amount?: number | null
          commission_paid?: boolean | null
          commission_paid_at?: string | null
          conversion_value?: number | null
          converted_at?: string | null
          created_at?: string
          estimated_project_value?: number | null
          homeowner_email?: string | null
          homeowner_name?: string | null
          homeowner_phone?: string | null
          id?: string
          lead_source: string
          lead_type: string
          notes?: string | null
          partner_id: string
          property_address?: string | null
          property_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          builder_id?: string | null
          commission_amount?: number | null
          commission_paid?: boolean | null
          commission_paid_at?: string | null
          conversion_value?: number | null
          converted_at?: string | null
          created_at?: string
          estimated_project_value?: number | null
          homeowner_email?: string | null
          homeowner_name?: string | null
          homeowner_phone?: string | null
          id?: string
          lead_source?: string
          lead_type?: string
          notes?: string | null
          partner_id?: string
          property_address?: string | null
          property_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_leads_builder_id_fkey"
            columns: ["builder_id"]
            isOneToOne: false
            referencedRelation: "builder_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_leads_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_leads_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_tiers: {
        Row: {
          co_marketing: boolean
          conversion_fee_percentage: number
          created_at: string
          exclusive_territory: boolean
          id: string
          lead_fee_flat: number
          min_monthly_leads: number
          priority_support: boolean
          tier_level: number
          tier_name: string
          updated_at: string
        }
        Insert: {
          co_marketing?: boolean
          conversion_fee_percentage: number
          created_at?: string
          exclusive_territory?: boolean
          id?: string
          lead_fee_flat?: number
          min_monthly_leads?: number
          priority_support?: boolean
          tier_level: number
          tier_name: string
          updated_at?: string
        }
        Update: {
          co_marketing?: boolean
          conversion_fee_percentage?: number
          created_at?: string
          exclusive_territory?: boolean
          id?: string
          lead_fee_flat?: number
          min_monthly_leads?: number
          priority_support?: boolean
          tier_level?: number
          tier_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          company_name: string
          contact_email: string
          contact_name: string
          contact_phone: string | null
          conversion_rate: number | null
          created_at: string
          id: string
          lifetime_value: number | null
          partner_type: string
          quality_score: number | null
          service_areas: string[] | null
          specialties: string[] | null
          status: string
          tier_id: string | null
          total_conversions: number | null
          total_leads_sent: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company_name: string
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          conversion_rate?: number | null
          created_at?: string
          id?: string
          lifetime_value?: number | null
          partner_type: string
          quality_score?: number | null
          service_areas?: string[] | null
          specialties?: string[] | null
          status?: string
          tier_id?: string | null
          total_conversions?: number | null
          total_leads_sent?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company_name?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          conversion_rate?: number | null
          created_at?: string
          id?: string
          lifetime_value?: number | null
          partner_type?: string
          quality_score?: number | null
          service_areas?: string[] | null
          specialties?: string[] | null
          status?: string
          tier_id?: string | null
          total_conversions?: number | null
          total_leads_sent?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partners_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "partner_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_analyses: {
        Row: {
          analysis_data: Json
          confidence_score: number | null
          created_at: string
          estimated_value_impact: number | null
          id: string
          materials_detected: string[] | null
          photo_url: string
          property_id: string | null
          renovation_quality: string | null
          rooms_identified: string[] | null
          updated_at: string
        }
        Insert: {
          analysis_data: Json
          confidence_score?: number | null
          created_at?: string
          estimated_value_impact?: number | null
          id?: string
          materials_detected?: string[] | null
          photo_url: string
          property_id?: string | null
          renovation_quality?: string | null
          rooms_identified?: string[] | null
          updated_at?: string
        }
        Update: {
          analysis_data?: Json
          confidence_score?: number | null
          created_at?: string
          estimated_value_impact?: number | null
          id?: string
          materials_detected?: string[] | null
          photo_url?: string
          property_id?: string | null
          renovation_quality?: string | null
          rooms_identified?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_analyses_property_id_fkey"
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
      property_search_campaigns: {
        Row: {
          analyzed_properties: number | null
          builder_id: string
          campaign_name: string
          created_at: string
          id: string
          search_parameters: Json
          search_type: string
          status: string
          total_properties: number | null
          updated_at: string
        }
        Insert: {
          analyzed_properties?: number | null
          builder_id: string
          campaign_name: string
          created_at?: string
          id?: string
          search_parameters: Json
          search_type: string
          status?: string
          total_properties?: number | null
          updated_at?: string
        }
        Update: {
          analyzed_properties?: number | null
          builder_id?: string
          campaign_name?: string
          created_at?: string
          id?: string
          search_parameters?: Json
          search_type?: string
          status?: string
          total_properties?: number | null
          updated_at?: string
        }
        Relationships: []
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
      targeted_properties: {
        Row: {
          address: string
          analysis_status: string
          analysis_summary: Json | null
          campaign_id: string
          city: string | null
          created_at: string
          id: string
          listing_data: Json | null
          photo_urls: string[] | null
          state: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address: string
          analysis_status?: string
          analysis_summary?: Json | null
          campaign_id: string
          city?: string | null
          created_at?: string
          id?: string
          listing_data?: Json | null
          photo_urls?: string[] | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string
          analysis_status?: string
          analysis_summary?: Json | null
          campaign_id?: string
          city?: string | null
          created_at?: string
          id?: string
          listing_data?: Json | null
          photo_urls?: string[] | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
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
