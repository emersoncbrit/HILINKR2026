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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_affiliate_plans: {
        Row: {
          affiliate_link: string | null
          commission: string
          created_at: string
          description: string | null
          id: string
          name: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          affiliate_link?: string | null
          commission: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          affiliate_link?: string | null
          commission?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      admin_categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      admin_platforms: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      admin_tutorials: {
        Row: {
          created_at: string
          description: string | null
          duration: string | null
          icon: string | null
          id: string
          sort_order: number | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: string | null
          icon?: string | null
          id?: string
          sort_order?: number | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: string | null
          icon?: string | null
          id?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      admin_venda_mais: {
        Row: {
          checkout_url: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          checkout_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          checkout_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          benefits: string[] | null
          button_color: string | null
          campaign_goal: string
          campaign_type: string
          created_at: string
          cta_text: string | null
          custom_faqs: Json | null
          description: string | null
          headline: string | null
          id: string
          image_url: string | null
          installment_text: string | null
          logo_url: string | null
          name: string
          newsletter_enabled: boolean | null
          product_id: string
          reviews: Json | null
          slug: string
          social_proof_text: string | null
          status: string
          subheadline: string | null
          updated_at: string
          urgency_text: string | null
          user_id: string
        }
        Insert: {
          benefits?: string[] | null
          button_color?: string | null
          campaign_goal?: string
          campaign_type?: string
          created_at?: string
          cta_text?: string | null
          custom_faqs?: Json | null
          description?: string | null
          headline?: string | null
          id?: string
          image_url?: string | null
          installment_text?: string | null
          logo_url?: string | null
          name: string
          newsletter_enabled?: boolean | null
          product_id: string
          reviews?: Json | null
          slug: string
          social_proof_text?: string | null
          status?: string
          subheadline?: string | null
          updated_at?: string
          urgency_text?: string | null
          user_id: string
        }
        Update: {
          benefits?: string[] | null
          button_color?: string | null
          campaign_goal?: string
          campaign_type?: string
          created_at?: string
          cta_text?: string | null
          custom_faqs?: Json | null
          description?: string | null
          headline?: string | null
          id?: string
          image_url?: string | null
          installment_text?: string | null
          logo_url?: string | null
          name?: string
          newsletter_enabled?: boolean | null
          product_id?: string
          reviews?: Json | null
          slug?: string
          social_proof_text?: string | null
          status?: string
          subheadline?: string | null
          updated_at?: string
          urgency_text?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      clicks: {
        Row: {
          campaign_id: string
          clicked_at: string
          id: string
          owner_id: string
          product_id: string
        }
        Insert: {
          campaign_id: string
          clicked_at?: string
          id?: string
          owner_id: string
          product_id: string
        }
        Update: {
          campaign_id?: string
          clicked_at?: string
          id?: string
          owner_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clicks_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clicks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      extensions_products: {
        Row: {
          checkout_url: string | null
          created_at: string
          full_description: string | null
          icon_url: string | null
          id: string
          images: string[] | null
          name: string
          platforms: string[]
          price: number
          short_description: string | null
          slug: string
          status: string
          updated_at: string
          version: string | null
        }
        Insert: {
          checkout_url?: string | null
          created_at?: string
          full_description?: string | null
          icon_url?: string | null
          id?: string
          images?: string[] | null
          name: string
          platforms?: string[]
          price?: number
          short_description?: string | null
          slug: string
          status?: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          checkout_url?: string | null
          created_at?: string
          full_description?: string | null
          icon_url?: string | null
          id?: string
          images?: string[] | null
          name?: string
          platforms?: string[]
          price?: number
          short_description?: string | null
          slug?: string
          status?: string
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      hub_configs: {
        Row: {
          banners: string[] | null
          created_at: string
          favicon_url: string | null
          featured_product_id: string | null
          header_color: string | null
          header_text_color: string | null
          id: string
          logo_url: string | null
          order_mode: string
          popup_bg_color: string | null
          popup_button_color: string | null
          popup_button_text: string | null
          popup_description: string | null
          popup_enabled: boolean
          popup_text_color: string | null
          popup_title: string | null
          primary_color: string | null
          secondary_color: string | null
          selected_product_ids: string[] | null
          slug: string
          social_links: Json | null
          store_description: string | null
          store_name: string | null
          store_template: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          banners?: string[] | null
          created_at?: string
          favicon_url?: string | null
          featured_product_id?: string | null
          header_color?: string | null
          header_text_color?: string | null
          id?: string
          logo_url?: string | null
          order_mode?: string
          popup_bg_color?: string | null
          popup_button_color?: string | null
          popup_button_text?: string | null
          popup_description?: string | null
          popup_enabled?: boolean
          popup_text_color?: string | null
          popup_title?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          selected_product_ids?: string[] | null
          slug: string
          social_links?: Json | null
          store_description?: string | null
          store_name?: string | null
          store_template?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          banners?: string[] | null
          created_at?: string
          favicon_url?: string | null
          featured_product_id?: string | null
          header_color?: string | null
          header_text_color?: string | null
          id?: string
          logo_url?: string | null
          order_mode?: string
          popup_bg_color?: string | null
          popup_button_color?: string | null
          popup_button_text?: string | null
          popup_description?: string | null
          popup_enabled?: boolean
          popup_text_color?: string | null
          popup_title?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          selected_product_ids?: string[] | null
          slug?: string
          social_links?: Json | null
          store_description?: string | null
          store_name?: string | null
          store_template?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hub_configs_featured_product_id_fkey"
            columns: ["featured_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      hub_leads: {
        Row: {
          created_at: string
          email: string
          hub_config_id: string
          id: string
          name: string
          owner_id: string
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          email: string
          hub_config_id: string
          id?: string
          name?: string
          owner_id: string
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          hub_config_id?: string
          id?: string
          name?: string
          owner_id?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hub_leads_hub_config_id_fkey"
            columns: ["hub_config_id"]
            isOneToOne: false
            referencedRelation: "hub_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      link_bio_configs: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          links: Json | null
          slug: string
          social_links: Json | null
          template: string | null
          theme_colors: Json | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          links?: Json | null
          slug: string
          social_links?: Json | null
          template?: string | null
          theme_colors?: Json | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          links?: Json | null
          slug?: string
          social_links?: Json | null
          template?: string | null
          theme_colors?: Json | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      manual_sales: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          sale_date: string
          sale_value: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          sale_date?: string
          sale_value?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          sale_date?: string
          sale_value?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "manual_sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          affiliate_link: string
          category: string | null
          commission_estimate: number | null
          created_at: string
          id: string
          image_url: string | null
          last_activated_at: string | null
          name: string
          original_link: string | null
          platform: string | null
          price: number | null
          status: string
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          affiliate_link: string
          category?: string | null
          commission_estimate?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          last_activated_at?: string | null
          name: string
          original_link?: string | null
          platform?: string | null
          price?: number | null
          status?: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          affiliate_link?: string
          category?: string | null
          commission_estimate?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          last_activated_at?: string | null
          name?: string
          original_link?: string | null
          platform?: string | null
          price?: number | null
          status?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          hub_slug: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
          username: string | null
          username_changed_at: string | null
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          hub_slug?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
          username_changed_at?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string | null
          hub_slug?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
          username_changed_at?: string | null
        }
        Relationships: []
      }
      story_templates: {
        Row: {
          bg_color: string
          card_border_color: string | null
          created_at: string
          disclaimer_text: string | null
          id: string
          name: string
          price_bg_color: string
          title_text: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bg_color?: string
          card_border_color?: string | null
          created_at?: string
          disclaimer_text?: string | null
          id?: string
          name?: string
          price_bg_color?: string
          title_text?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bg_color?: string
          card_border_color?: string | null
          created_at?: string
          disclaimer_text?: string | null
          id?: string
          name?: string
          price_bg_color?: string
          title_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
