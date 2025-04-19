export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          user_id: string
          content: string
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      answers: {
        Row: {
          id: string
          question_id: string
          user_id: string
          content: string | null
          media_url: string | null
          media_type: "video" | "image" | "text" | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question_id: string
          user_id: string
          content?: string | null
          media_url?: string | null
          media_type?: "video" | "image" | "text" | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          user_id?: string
          content?: string | null
          media_url?: string | null
          media_type?: "video" | "image" | "text" | null
          created_at?: string
          updated_at?: string
        }
      }
      follows: {
        Row: {
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      likes: {
        Row: {
          user_id: string
          answer_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          answer_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          answer_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          answer_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          answer_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          answer_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
