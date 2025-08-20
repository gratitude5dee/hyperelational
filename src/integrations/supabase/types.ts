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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      chat_sessions: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          messages: Json | null
          project_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          messages?: Json | null
          project_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          messages?: Json | null
          project_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      concerts: {
        Row: {
          actual_attendance: number | null
          capacity: number | null
          city: string | null
          created_at: string | null
          date: string | null
          id: string
          predicted_attendance: number | null
          project_id: string | null
          venue_data: Json | null
          venue_name: string
        }
        Insert: {
          actual_attendance?: number | null
          capacity?: number | null
          city?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          predicted_attendance?: number | null
          project_id?: string | null
          venue_data?: Json | null
          venue_name: string
        }
        Update: {
          actual_attendance?: number | null
          capacity?: number | null
          city?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          predicted_attendance?: number | null
          project_id?: string | null
          venue_data?: Json | null
          venue_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "concerts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      creative_analytics: {
        Row: {
          comments: number | null
          content_id: string | null
          created_at: string | null
          date: string | null
          demographics: Json | null
          id: string
          likes: number | null
          platform: string | null
          plays: number | null
          revenue: number | null
          shares: number | null
        }
        Insert: {
          comments?: number | null
          content_id?: string | null
          created_at?: string | null
          date?: string | null
          demographics?: Json | null
          id?: string
          likes?: number | null
          platform?: string | null
          plays?: number | null
          revenue?: number | null
          shares?: number | null
        }
        Update: {
          comments?: number | null
          content_id?: string | null
          created_at?: string | null
          date?: string | null
          demographics?: Json | null
          id?: string
          likes?: number | null
          platform?: string | null
          plays?: number | null
          revenue?: number | null
          shares?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "creative_analytics_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "creative_content"
            referencedColumns: ["id"]
          },
        ]
      }
      creative_content: {
        Row: {
          content_type: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          platforms: Json | null
          project_id: string | null
          release_date: string | null
          rights: Json | null
          title: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          platforms?: Json | null
          project_id?: string | null
          release_date?: string | null
          rights?: Json | null
          title: string
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          platforms?: Json | null
          project_id?: string | null
          release_date?: string | null
          rights?: Json | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "creative_content_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          acquisition_channel: string | null
          acquisition_date: string | null
          age: number | null
          churn_risk: number | null
          city: string | null
          communication_preferences: Json | null
          country: string | null
          created_at: string | null
          email: string | null
          gender: string | null
          id: string
          last_purchase: string | null
          lifetime_value: number | null
          metadata: Json | null
          name: string | null
          preferred_categories: Json | null
          project_id: string | null
          segment: string | null
          zip_code: string | null
        }
        Insert: {
          acquisition_channel?: string | null
          acquisition_date?: string | null
          age?: number | null
          churn_risk?: number | null
          city?: string | null
          communication_preferences?: Json | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          last_purchase?: string | null
          lifetime_value?: number | null
          metadata?: Json | null
          name?: string | null
          preferred_categories?: Json | null
          project_id?: string | null
          segment?: string | null
          zip_code?: string | null
        }
        Update: {
          acquisition_channel?: string | null
          acquisition_date?: string | null
          age?: number | null
          churn_risk?: number | null
          city?: string | null
          communication_preferences?: Json | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          last_purchase?: string | null
          lifetime_value?: number | null
          metadata?: Json | null
          name?: string | null
          preferred_categories?: Json | null
          project_id?: string | null
          segment?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboards: {
        Row: {
          created_at: string
          id: string
          layout: Json | null
          name: string
          project_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          layout?: Json | null
          name: string
          project_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          layout?: Json | null
          name?: string
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboards_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      data_sources: {
        Row: {
          created_at: string
          credentials: string | null
          display_name: string
          id: string
          last_synced_at: string | null
          project_id: string
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          credentials?: string | null
          display_name: string
          id?: string
          last_synced_at?: string | null
          project_id: string
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          credentials?: string | null
          display_name?: string
          id?: string
          last_synced_at?: string | null
          project_id?: string
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_sources_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      fans: {
        Row: {
          acquisition_channel: string | null
          age: number | null
          city: string | null
          communication_preferences: Json | null
          country: string | null
          created_at: string | null
          email: string | null
          engagement_score: number | null
          favorite_tracks: Json | null
          gender: string | null
          id: string
          last_interaction: string | null
          location: Json | null
          project_id: string | null
          social_handles: Json | null
          superfan_status: boolean | null
          username: string | null
        }
        Insert: {
          acquisition_channel?: string | null
          age?: number | null
          city?: string | null
          communication_preferences?: Json | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          engagement_score?: number | null
          favorite_tracks?: Json | null
          gender?: string | null
          id?: string
          last_interaction?: string | null
          location?: Json | null
          project_id?: string | null
          social_handles?: Json | null
          superfan_status?: boolean | null
          username?: string | null
        }
        Update: {
          acquisition_channel?: string | null
          age?: number | null
          city?: string | null
          communication_preferences?: Json | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          engagement_score?: number | null
          favorite_tracks?: Json | null
          gender?: string | null
          id?: string
          last_interaction?: string | null
          location?: Json | null
          project_id?: string | null
          social_handles?: Json | null
          superfan_status?: boolean | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fans_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      fashion_inventory: {
        Row: {
          category: string | null
          color: string | null
          cost: number | null
          current_stock: number | null
          id: string
          lead_time_days: number | null
          location: Json | null
          product_name: string | null
          project_id: string | null
          reorder_point: number | null
          reserved_stock: number | null
          retail_price: number | null
          size: string | null
          sku: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          color?: string | null
          cost?: number | null
          current_stock?: number | null
          id?: string
          lead_time_days?: number | null
          location?: Json | null
          product_name?: string | null
          project_id?: string | null
          reorder_point?: number | null
          reserved_stock?: number | null
          retail_price?: number | null
          size?: string | null
          sku: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          color?: string | null
          cost?: number | null
          current_stock?: number | null
          id?: string
          lead_time_days?: number | null
          location?: Json | null
          product_name?: string | null
          project_id?: string | null
          reorder_point?: number | null
          reserved_stock?: number | null
          retail_price?: number | null
          size?: string | null
          sku?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fashion_inventory_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      fashion_orders: {
        Row: {
          channel: string | null
          created_at: string | null
          customer_id: string | null
          fulfilled_at: string | null
          id: string
          items: Json | null
          order_number: string | null
          project_id: string | null
          shipping: number | null
          status: string | null
          subtotal: number | null
          tax: number | null
          total: number | null
        }
        Insert: {
          channel?: string | null
          created_at?: string | null
          customer_id?: string | null
          fulfilled_at?: string | null
          id?: string
          items?: Json | null
          order_number?: string | null
          project_id?: string | null
          shipping?: number | null
          status?: string | null
          subtotal?: number | null
          tax?: number | null
          total?: number | null
        }
        Update: {
          channel?: string | null
          created_at?: string | null
          customer_id?: string | null
          fulfilled_at?: string | null
          id?: string
          items?: Json | null
          order_number?: string | null
          project_id?: string | null
          shipping?: number | null
          status?: string | null
          subtotal?: number | null
          tax?: number | null
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fashion_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_configs: {
        Row: {
          auth_type: string | null
          category: string | null
          config: Json | null
          created_at: string | null
          credentials: string | null
          error_log: Json | null
          id: string
          last_sync: string | null
          project_id: string | null
          service: string
          status: string | null
          sync_frequency: unknown | null
        }
        Insert: {
          auth_type?: string | null
          category?: string | null
          config?: Json | null
          created_at?: string | null
          credentials?: string | null
          error_log?: Json | null
          id?: string
          last_sync?: string | null
          project_id?: string | null
          service: string
          status?: string | null
          sync_frequency?: unknown | null
        }
        Update: {
          auth_type?: string | null
          category?: string | null
          config?: Json | null
          created_at?: string | null
          credentials?: string | null
          error_log?: Json | null
          id?: string
          last_sync?: string | null
          project_id?: string | null
          service?: string
          status?: string | null
          sync_frequency?: unknown | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_configs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      merch_items: {
        Row: {
          category: string | null
          colors: Json | null
          cost: number | null
          created_at: string
          description: string | null
          id: string
          images: Json | null
          is_venue_exclusive: boolean | null
          name: string
          price: number | null
          project_id: string | null
          sizes: Json | null
          stock_quantity: number | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          colors?: Json | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          is_venue_exclusive?: boolean | null
          name: string
          price?: number | null
          project_id?: string | null
          sizes?: Json | null
          stock_quantity?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          colors?: Json | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          is_venue_exclusive?: boolean | null
          name?: string
          price?: number | null
          project_id?: string | null
          sizes?: Json | null
          stock_quantity?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      merch_sales: {
        Row: {
          created_at: string
          event_id: string | null
          fan_id: string | null
          id: string
          location: Json | null
          merch_item_id: string | null
          project_id: string | null
          quantity: number
          sale_channel: string | null
          timestamp: string
          total_price: number | null
          unit_price: number | null
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          fan_id?: string | null
          id?: string
          location?: Json | null
          merch_item_id?: string | null
          project_id?: string | null
          quantity?: number
          sale_channel?: string | null
          timestamp?: string
          total_price?: number | null
          unit_price?: number | null
        }
        Update: {
          created_at?: string
          event_id?: string | null
          fan_id?: string | null
          id?: string
          location?: Json | null
          merch_item_id?: string | null
          project_id?: string | null
          quantity?: number
          sale_channel?: string | null
          timestamp?: string
          total_price?: number | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "merch_sales_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "concerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merch_sales_fan_id_fkey"
            columns: ["fan_id"]
            isOneToOne: false
            referencedRelation: "fans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merch_sales_merch_item_id_fkey"
            columns: ["merch_item_id"]
            isOneToOne: false
            referencedRelation: "merch_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          discount_amount: number | null
          id: string
          order_id: string | null
          product_id: string | null
          quantity: number
          total_price: number | null
          unit_price: number | null
        }
        Insert: {
          created_at?: string
          discount_amount?: number | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number
          total_price?: number | null
          unit_price?: number | null
        }
        Update: {
          created_at?: string
          discount_amount?: number | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number
          total_price?: number | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number | null
          created_at: string | null
          customer_id: string | null
          id: string
          product_id: string | null
          project_id: string | null
          quantity: number | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          product_id?: string | null
          project_id?: string | null
          quantity?: number | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          product_id?: string | null
          project_id?: string | null
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      page_views: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          product_id: string | null
          project_id: string | null
          session_id: string | null
          timestamp: string
          url: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          product_id?: string | null
          project_id?: string | null
          session_id?: string | null
          timestamp?: string
          url?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          product_id?: string | null
          project_id?: string | null
          session_id?: string | null
          timestamp?: string
          url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_views_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      predictions: {
        Row: {
          created_at: string
          id: string
          project_id: string
          query_hash: string
          result: Json
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          query_hash: string
          result: Json
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          query_hash?: string
          result?: Json
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "predictions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category: string | null
          color: string | null
          created_at: string | null
          id: string
          images: Json | null
          material: string | null
          name: string
          price: number | null
          project_id: string | null
          season: string | null
          size: string | null
          sku: string | null
          stock_quantity: number | null
          style_attributes: Json | null
          trend_score: number | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          images?: Json | null
          material?: string | null
          name: string
          price?: number | null
          project_id?: string | null
          season?: string | null
          size?: string | null
          sku?: string | null
          stock_quantity?: number | null
          style_attributes?: Json | null
          trend_score?: number | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          images?: Json | null
          material?: string | null
          name?: string
          price?: number | null
          project_id?: string | null
          season?: string | null
          size?: string | null
          sku?: string | null
          stock_quantity?: number | null
          style_attributes?: Json | null
          trend_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: string | null
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_type?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_type?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          id: string
          name: string
          type: string
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          type: string
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          type?: string
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      relationship_graphs: {
        Row: {
          created_at: string | null
          edges: Json | null
          graph_type: string
          id: string
          metadata: Json | null
          nodes: Json | null
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          edges?: Json | null
          graph_type: string
          id?: string
          metadata?: Json | null
          nodes?: Json | null
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          edges?: Json | null
          graph_type?: string
          id?: string
          metadata?: Json | null
          nodes?: Json | null
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relationship_graphs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_queries: {
        Row: {
          created_at: string | null
          id: string
          name: string
          pql_query: string
          project_id: string | null
          query_type: string | null
          user_id: string
          visualization_config: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          pql_query: string
          project_id?: string | null
          query_type?: string | null
          user_id: string
          visualization_config?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          pql_query?: string
          project_id?: string | null
          query_type?: string | null
          user_id?: string
          visualization_config?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_queries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      streams: {
        Row: {
          album_name: string | null
          artist_name: string | null
          created_at: string
          duration_ms: number | null
          fan_id: string | null
          id: string
          location: Json | null
          platform: string | null
          play_count: number | null
          project_id: string | null
          timestamp: string
          track_name: string | null
        }
        Insert: {
          album_name?: string | null
          artist_name?: string | null
          created_at?: string
          duration_ms?: number | null
          fan_id?: string | null
          id?: string
          location?: Json | null
          platform?: string | null
          play_count?: number | null
          project_id?: string | null
          timestamp?: string
          track_name?: string | null
        }
        Update: {
          album_name?: string | null
          artist_name?: string | null
          created_at?: string
          duration_ms?: number | null
          fan_id?: string | null
          id?: string
          location?: Json | null
          platform?: string | null
          play_count?: number | null
          project_id?: string | null
          timestamp?: string
          track_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "streams_fan_id_fkey"
            columns: ["fan_id"]
            isOneToOne: false
            referencedRelation: "fans"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_sales: {
        Row: {
          created_at: string
          event_id: string | null
          fan_id: string | null
          fees: number | null
          id: string
          project_id: string | null
          purchase_date: string
          quantity: number
          sale_channel: string | null
          ticket_type: string | null
          total_price: number | null
          unit_price: number | null
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          fan_id?: string | null
          fees?: number | null
          id?: string
          project_id?: string | null
          purchase_date?: string
          quantity?: number
          sale_channel?: string | null
          ticket_type?: string | null
          total_price?: number | null
          unit_price?: number | null
        }
        Update: {
          created_at?: string
          event_id?: string | null
          fan_id?: string | null
          fees?: number | null
          id?: string
          project_id?: string | null
          purchase_date?: string
          quantity?: number
          sale_channel?: string | null
          ticket_type?: string | null
          total_price?: number | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_sales_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "concerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_sales_fan_id_fkey"
            columns: ["fan_id"]
            isOneToOne: false
            referencedRelation: "fans"
            referencedColumns: ["id"]
          },
        ]
      }
      tours_events: {
        Row: {
          capacity: number | null
          created_at: string | null
          date: string | null
          event_type: string | null
          expenses: Json | null
          gross_revenue: number | null
          id: string
          name: string | null
          project_id: string | null
          status: string | null
          tickets_sold: number | null
          venue: Json | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          date?: string | null
          event_type?: string | null
          expenses?: Json | null
          gross_revenue?: number | null
          id?: string
          name?: string | null
          project_id?: string | null
          status?: string | null
          tickets_sold?: number | null
          venue?: Json | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          date?: string | null
          event_type?: string | null
          expenses?: Json | null
          gross_revenue?: number | null
          id?: string
          name?: string | null
          project_id?: string | null
          status?: string | null
          tickets_sold?: number | null
          venue?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "tours_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      widgets: {
        Row: {
          created_at: string
          dashboard_id: string
          id: string
          position: Json | null
          query_config: Json | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          dashboard_id: string
          id?: string
          position?: Json | null
          query_config?: Json | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          dashboard_id?: string
          id?: string
          position?: Json | null
          query_config?: Json | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "widgets_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "dashboards"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_automations: {
        Row: {
          actions: Json | null
          created_at: string | null
          enabled: boolean | null
          id: string
          last_run: string | null
          name: string | null
          project_id: string | null
          trigger_config: Json | null
          trigger_type: string | null
        }
        Insert: {
          actions?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          last_run?: string | null
          name?: string | null
          project_id?: string | null
          trigger_config?: Json | null
          trigger_type?: string | null
        }
        Update: {
          actions?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          last_run?: string | null
          name?: string | null
          project_id?: string | null
          trigger_config?: Json | null
          trigger_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_automations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          updated_at?: string | null
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
