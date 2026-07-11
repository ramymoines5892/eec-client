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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      branches: {
        Row: {
          address: string | null
          code: string
          company_id: string
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          code: string
          company_id: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          code?: string
          company_id?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "branches_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          code: string
          company_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          code: string
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          code?: string
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          company_id: string
          created_at: string
          email: string | null
          employee_no: string
          full_name: string
          full_name_ar: string | null
          hire_date: string | null
          id: string
          phone: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          email?: string | null
          employee_no: string
          full_name: string
          full_name_ar?: string | null
          hire_date?: string | null
          id?: string
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string | null
          employee_no?: string
          full_name?: string
          full_name_ar?: string | null
          hire_date?: string | null
          id?: string
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_approvals: {
        Row: {
          approver_id: string | null
          created_at: string
          decided_at: string | null
          decision: string
          entity_id: string
          entity_type: string
          id: string
          note: string | null
          step_no: number
        }
        Insert: {
          approver_id?: string | null
          created_at?: string
          decided_at?: string | null
          decision?: string
          entity_id: string
          entity_type: string
          id?: string
          note?: string | null
          step_no?: number
        }
        Update: {
          approver_id?: string | null
          created_at?: string
          decided_at?: string | null
          decision?: string
          entity_id?: string
          entity_type?: string
          id?: string
          note?: string | null
          step_no?: number
        }
        Relationships: []
      }
      entity_attachments: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          file_name: string
          file_path: string
          id: string
          mime_type: string | null
          size_bytes: number | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          file_name: string
          file_path: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          file_name?: string
          file_path?: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      entity_comments: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      entity_history: {
        Row: {
          action: string
          actor_id: string | null
          changes: Json
          created_at: string
          entity_id: string
          entity_type: string
          from_status: string | null
          id: string
          note: string | null
          to_status: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          changes?: Json
          created_at?: string
          entity_id: string
          entity_type: string
          from_status?: string | null
          id?: string
          note?: string | null
          to_status?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          changes?: Json
          created_at?: string
          entity_id?: string
          entity_type?: string
          from_status?: string | null
          id?: string
          note?: string | null
          to_status?: string | null
        }
        Relationships: []
      }
      entity_revisions: {
        Row: {
          created_at: string
          created_by: string | null
          entity_id: string
          entity_type: string
          id: string
          revision_no: number
          snapshot: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          entity_id: string
          entity_type: string
          id?: string
          revision_no: number
          snapshot: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          revision_no?: number
          snapshot?: Json
        }
        Relationships: []
      }
      job_titles: {
        Row: {
          code: string
          company_id: string
          created_at: string
          description: string | null
          grade: string | null
          id: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          code: string
          company_id: string
          created_at?: string
          description?: string | null
          grade?: string | null
          id?: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          code?: string
          company_id?: string
          created_at?: string
          description?: string | null
          grade?: string | null
          id?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_titles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      position_assignments: {
        Row: {
          branch_id: string | null
          created_at: string
          department_id: string | null
          effective_from: string
          effective_to: string | null
          employee_id: string
          id: string
          is_primary: boolean
          job_title_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string
          department_id?: string | null
          effective_from?: string
          effective_to?: string | null
          employee_id: string
          id?: string
          is_primary?: boolean
          job_title_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string
          department_id?: string | null
          effective_from?: string
          effective_to?: string | null
          employee_id?: string
          id?: string
          is_primary?: boolean
          job_title_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "position_assignments_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "position_assignments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "position_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "position_assignments_job_title_id_fkey"
            columns: ["job_title_id"]
            isOneToOne: false
            referencedRelation: "job_titles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reference_sources: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_hierarchical: boolean
          is_system: boolean
          name_ar: string
          name_en: string
          status: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_hierarchical?: boolean
          is_system?: boolean
          name_ar: string
          name_en: string
          status?: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_hierarchical?: boolean
          is_system?: boolean
          name_ar?: string
          name_en?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      reference_values: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          metadata: Json
          name_ar: string
          name_en: string
          parent_id: string | null
          sort_order: number
          source_id: string
          status: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          name_ar: string
          name_en: string
          parent_id?: string | null
          sort_order?: number
          source_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          name_ar?: string
          name_en?: string
          parent_id?: string | null
          sort_order?: number
          source_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reference_values_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "reference_values"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reference_values_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "reference_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "employee"
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
    Enums: {
      app_role: ["admin", "manager", "employee"],
    },
  },
} as const
