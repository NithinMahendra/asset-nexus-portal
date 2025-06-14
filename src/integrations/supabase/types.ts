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
      activity_log: {
        Row: {
          action: string
          asset_id: string | null
          details: Json | null
          id: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action: string
          asset_id?: string | null
          details?: Json | null
          id?: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          asset_id?: string | null
          details?: Json | null
          id?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_assignments: {
        Row: {
          asset_id: string
          assigned_at: string
          assigned_by: string
          id: string
          returned_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          asset_id: string
          assigned_at?: string
          assigned_by: string
          id?: string
          returned_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          asset_id?: string
          assigned_at?: string
          assigned_by?: string
          id?: string
          returned_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_assignments_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_history: {
        Row: {
          action: string
          asset_id: string
          created_at: string
          date: string
          details: string | null
          id: string
          organization_id: string | null
          user_id: string | null
          user_name: string
        }
        Insert: {
          action: string
          asset_id: string
          created_at?: string
          date?: string
          details?: string | null
          id?: string
          organization_id?: string | null
          user_id?: string | null
          user_name: string
        }
        Update: {
          action?: string
          asset_id?: string
          created_at?: string
          date?: string
          details?: string | null
          id?: string
          organization_id?: string | null
          user_id?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_history_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_lifecycle_stats: {
        Row: {
          avg_age_years: number
          created_at: string
          id: string
          lifecycle_stage: string
          total_count: number
          total_value: number
          updated_at: string
        }
        Insert: {
          avg_age_years?: number
          created_at?: string
          id?: string
          lifecycle_stage: string
          total_count?: number
          total_value?: number
          updated_at?: string
        }
        Update: {
          avg_age_years?: number
          created_at?: string
          id?: string
          lifecycle_stage?: string
          total_count?: number
          total_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      asset_requests: {
        Row: {
          asset_id: string | null
          description: string
          id: string
          processed_at: string | null
          processed_by: string | null
          request_type: string
          requested_at: string
          status: string
          user_id: string
        }
        Insert: {
          asset_id?: string | null
          description: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          request_type: string
          requested_at?: string
          status?: string
          user_id: string
        }
        Update: {
          asset_id?: string | null
          description?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          request_type?: string
          requested_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_requests_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          assigned_date: string | null
          assigned_to: string | null
          brand: string | null
          category: string
          created_at: string
          description: string | null
          device_type: string | null
          id: string
          location: string | null
          model: string | null
          name: string
          organization_id: string | null
          purchase_date: string
          qr_code: string | null
          serial_number: string | null
          status: string
          value: number | null
          warranty_expiry: string | null
        }
        Insert: {
          assigned_date?: string | null
          assigned_to?: string | null
          brand?: string | null
          category: string
          created_at?: string
          description?: string | null
          device_type?: string | null
          id?: string
          location?: string | null
          model?: string | null
          name: string
          organization_id?: string | null
          purchase_date: string
          qr_code?: string | null
          serial_number?: string | null
          status: string
          value?: number | null
          warranty_expiry?: string | null
        }
        Update: {
          assigned_date?: string | null
          assigned_to?: string | null
          brand?: string | null
          category?: string
          created_at?: string
          description?: string | null
          device_type?: string | null
          id?: string
          location?: string | null
          model?: string | null
          name?: string
          organization_id?: string | null
          purchase_date?: string
          qr_code?: string | null
          serial_number?: string | null
          status?: string
          value?: number | null
          warranty_expiry?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          operation: string
          record_id: string
          table_name: string
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation: string
          record_id: string
          table_name: string
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation?: string
          record_id?: string
          table_name?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      employee_profiles: {
        Row: {
          created_at: string | null
          email: string
          employee_id: string
          first_name: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          employee_id: string
          first_name: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          employee_id?: string
          first_name?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      invitations: {
        Row: {
          created_at: string | null
          email: string | null
          expires_at: string | null
          id: string
          organization_id: string
          role: string
          status: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          expires_at?: string | null
          id?: string
          organization_id: string
          role?: string
          status?: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          expires_at?: string | null
          id?: string
          organization_id?: string
          role?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_schedule: {
        Row: {
          asset_id: string
          assigned_to: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          maintenance_type: string
          schedule_date: string
          status: string
          updated_at: string
        }
        Insert: {
          asset_id: string
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          maintenance_type: string
          schedule_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          asset_id?: string
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          maintenance_type?: string
          schedule_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_schedule_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          department: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          department: string | null
          email: string
          id: string
          name: string
          organization_id: string | null
          phone: string | null
          profile_image_url: string | null
          role: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          email: string
          id?: string
          name: string
          organization_id?: string | null
          phone?: string | null
          profile_image_url?: string | null
          role: string
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string
          id?: string
          name?: string
          organization_id?: string | null
          phone?: string | null
          profile_image_url?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_maintenance_task: {
        Args: {
          p_asset_id: string
          p_schedule_date: string
          p_maintenance_type: string
          p_description: string
          p_status: string
          p_assigned_to: string
          p_created_by: string
        }
        Returns: {
          id: string
          asset_id: string
          schedule_date: string
          maintenance_type: string
          description: string
          status: string
          created_by: string
          created_at: string
          updated_at: string
        }[]
      }
      get_asset_lifecycle_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          lifecycle_stage: string
          total_count: number
          avg_age_years: number
          total_value: number
          created_at: string
          updated_at: string
        }[]
      }
      get_audit_logs: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          table_name: string
          record_id: string
          operation: string
          old_data: Json
          new_data: Json
          changed_by: string
          changed_at: string
        }[]
      }
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_maintenance_due_soon: {
        Args: { days_threshold: number }
        Returns: {
          maintenance_id: string
          asset_id: string
          asset_name: string
          schedule_date: string
          maintenance_type: string
          status: string
        }[]
      }
      get_maintenance_schedules: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          asset_id: string
          asset_name: string
          schedule_date: string
          maintenance_type: string
          description: string
          status: string
          assigned_to: Json
          created_by: string
          created_at: string
          updated_at: string
        }[]
      }
      get_vendor_by_id: {
        Args: { vendor_id: string }
        Returns: {
          id: string
          name: string
          contact_name: string
          email: string
          phone: string
          address: string
          website: string
          notes: string
          created_at: string
          updated_at: string
        }[]
      }
      get_vendors: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          contact_name: string
          email: string
          phone: string
          address: string
          website: string
          notes: string
          created_at: string
          updated_at: string
        }[]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "employee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "employee"],
    },
  },
} as const
