export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  team_id: string | null;
  role: "owner" | "admin" | "member";
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  plan: "free" | "pro" | "enterprise";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: "active" | "trialing" | "past_due" | "cancelled" | null;
  trial_ends_at: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  team_id: string;
  name: string;
  description: string | null;
  status: "active" | "archived";
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Invitation {
  id: string;
  team_id: string;
  email: string;
  role: "admin" | "member";
  token: string;
  expires_at: string;
  accepted_at: string | null;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  limits: { projects: number; members: number; storage_gb: number };
  stripe_price_id: string;
}

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, "created_at">; Update: Partial<Profile> };
      teams: { Row: Team; Insert: Omit<Team, "id" | "created_at">; Update: Partial<Team> };
      projects: { Row: Project; Insert: Omit<Project, "id" | "created_at" | "updated_at">; Update: Partial<Project> };
      invitations: { Row: Invitation; Insert: Omit<Invitation, "id">; Update: Partial<Invitation> };
    };
  };
}
