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
      admin_settings: {
        Row: {
          account_lockout_duration_minutes: number
          allowed_file_types: string
          contact_form_enabled: boolean
          created_at: string
          email_notifications_enabled: boolean
          email_verification_expiry_hours: number
          file_upload_max_size_mb: number
          from_email: string
          from_name: string
          id: string
          maintenance_mode: boolean
          max_login_attempts: number
          newsletter_enabled: boolean
          password_reset_expiry_hours: number
          session_timeout_hours: number
          smtp_host: string
          smtp_password: string
          smtp_port: number
          smtp_reply_to: string
          smtp_use_tls: boolean
          smtp_username: string
          updated_at: string
          user_registration_enabled: boolean
        }
        Insert: {
          account_lockout_duration_minutes?: number
          allowed_file_types?: string
          contact_form_enabled?: boolean
          created_at?: string
          email_notifications_enabled?: boolean
          email_verification_expiry_hours?: number
          file_upload_max_size_mb?: number
          from_email?: string
          from_name?: string
          id?: string
          maintenance_mode?: boolean
          max_login_attempts?: number
          newsletter_enabled?: boolean
          password_reset_expiry_hours?: number
          session_timeout_hours?: number
          smtp_host?: string
          smtp_password?: string
          smtp_port?: number
          smtp_reply_to?: string
          smtp_use_tls?: boolean
          smtp_username?: string
          updated_at?: string
          user_registration_enabled?: boolean
        }
        Update: {
          account_lockout_duration_minutes?: number
          allowed_file_types?: string
          contact_form_enabled?: boolean
          created_at?: string
          email_notifications_enabled?: boolean
          email_verification_expiry_hours?: number
          file_upload_max_size_mb?: number
          from_email?: string
          from_name?: string
          id?: string
          maintenance_mode?: boolean
          max_login_attempts?: number
          newsletter_enabled?: boolean
          password_reset_expiry_hours?: number
          session_timeout_hours?: number
          smtp_host?: string
          smtp_password?: string
          smtp_port?: number
          smtp_reply_to?: string
          smtp_use_tls?: boolean
          smtp_username?: string
          updated_at?: string
          user_registration_enabled?: boolean
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          published: boolean | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_projects: {
        Row: {
          actual_completion: string | null
          client_user_id: string | null
          created_at: string
          estimated_completion: string | null
          id: string
          notes: string | null
          progress: number | null
          project_id: string | null
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          actual_completion?: string | null
          client_user_id?: string | null
          created_at?: string
          estimated_completion?: string | null
          id?: string
          notes?: string | null
          progress?: number | null
          project_id?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          actual_completion?: string | null
          client_user_id?: string | null
          created_at?: string
          estimated_completion?: string | null
          id?: string
          notes?: string | null
          progress?: number | null
          project_id?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_projects_client_user_id_fkey"
            columns: ["client_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean | null
          subject: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean | null
          subject?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean | null
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_automation_jobs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          recipient_email: string
          retry_count: number | null
          rule_id: string | null
          sent_at: string | null
          status: string
          template_variables: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          recipient_email: string
          retry_count?: number | null
          rule_id?: string | null
          sent_at?: string | null
          status?: string
          template_variables?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          recipient_email?: string
          retry_count?: number | null
          rule_id?: string | null
          sent_at?: string | null
          status?: string
          template_variables?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_automation_jobs_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "email_automation_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      email_automation_rules: {
        Row: {
          conditions: Json | null
          created_at: string
          event_type: string
          id: string
          is_active: boolean
          template_id: string | null
          updated_at: string
        }
        Insert: {
          conditions?: Json | null
          created_at?: string
          event_type: string
          id?: string
          is_active?: boolean
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          conditions?: Json | null
          created_at?: string
          event_type?: string
          id?: string
          is_active?: boolean
          template_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_automation_rules_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_senders: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_default: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_template_assignments: {
        Row: {
          created_at: string
          event_type: string
          id: string
          is_active: boolean | null
          template_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          is_active?: boolean | null
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          is_active?: boolean | null
          template_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_template_assignments_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_template_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          is_default: boolean | null
          name: string
          subject: string
          trigger_event: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          name: string
          subject: string
          trigger_event?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string
          subject?: string
          trigger_event?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      email_verification_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      newsletters: {
        Row: {
          content: string
          created_at: string
          id: string
          recipient_count: number | null
          sent_at: string | null
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          recipient_count?: number | null
          sent_at?: string | null
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          recipient_count?: number | null
          sent_at?: string | null
          subject?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          company: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          full_name: string | null
          id: string
          job_title: string | null
          last_name: string | null
          phone: string | null
          state: string | null
          updated_at: string
          username: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          id: string
          job_title?: string | null
          last_name?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
          username?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
          username?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      project_files: {
        Row: {
          client_project_id: string | null
          created_at: string
          description: string | null
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          is_public_to_client: boolean | null
          mime_type: string | null
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          client_project_id?: string | null
          created_at?: string
          description?: string | null
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          is_public_to_client?: boolean | null
          mime_type?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          client_project_id?: string | null
          created_at?: string
          description?: string | null
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          is_public_to_client?: boolean | null
          mime_type?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_files_client_project_id_fkey"
            columns: ["client_project_id"]
            isOneToOne: false
            referencedRelation: "client_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_updates: {
        Row: {
          client_project_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_visible_to_client: boolean | null
          progress_percentage: number | null
          title: string
          update_type: string | null
          updated_at: string
        }
        Insert: {
          client_project_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_visible_to_client?: boolean | null
          progress_percentage?: number | null
          title: string
          update_type?: string | null
          updated_at?: string
        }
        Update: {
          client_project_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_visible_to_client?: boolean | null
          progress_percentage?: number | null
          title?: string
          update_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_updates_client_project_id_fkey"
            columns: ["client_project_id"]
            isOneToOne: false
            referencedRelation: "client_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          status: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          client?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          client?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          status: string | null
          subscribed: boolean | null
          subscribed_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          status?: string | null
          subscribed?: boolean | null
          subscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          status?: string | null
          subscribed?: boolean | null
          subscribed_at?: string | null
          updated_at?: string
        }
        Relationships: []
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
          role?: Database["public"]["Enums"]["app_role"]
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
      get_admin_counts: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin_user: {
        Args: { user_id: string }
        Returns: boolean
      }
      make_user_admin: {
        Args: { _user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const