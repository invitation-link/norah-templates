// Database Types for MagicInvite

export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    phone: string | null
                    name: string | null
                    email: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    phone?: string | null
                    name?: string | null
                    email?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    phone?: string | null
                    name?: string | null
                    email?: string | null
                    created_at?: string
                }
            }
            invitations: {
                Row: {
                    id: string
                    user_id: string
                    template_id: string
                    title: string
                    event_name: string
                    event_date: string
                    event_time: string
                    venue: string
                    venue_address: string | null
                    venue_map_url: string | null
                    slug: string
                    photos: string[] | null
                    music_url: string | null
                    message: string | null
                    views: number
                    is_published: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    template_id: string
                    title: string
                    event_name: string
                    event_date: string
                    event_time: string
                    venue: string
                    venue_address?: string | null
                    venue_map_url?: string | null
                    slug: string
                    photos?: string[] | null
                    music_url?: string | null
                    message?: string | null
                    views?: number
                    is_published?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    template_id?: string
                    title?: string
                    event_name?: string
                    event_date?: string
                    event_time?: string
                    venue?: string
                    venue_address?: string | null
                    venue_map_url?: string | null
                    slug?: string
                    photos?: string[] | null
                    music_url?: string | null
                    message?: string | null
                    views?: number
                    is_published?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            rsvps: {
                Row: {
                    id: string
                    invitation_id: string
                    guest_name: string
                    guest_phone: string | null
                    guest_email: string | null
                    attending: boolean
                    guests_count: number
                    message: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    invitation_id: string
                    guest_name: string
                    guest_phone?: string | null
                    guest_email?: string | null
                    attending: boolean
                    guests_count?: number
                    message?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    invitation_id?: string
                    guest_name?: string
                    guest_phone?: string | null
                    guest_email?: string | null
                    attending?: boolean
                    guests_count?: number
                    message?: string | null
                    created_at?: string
                }
            }
            analytics: {
                Row: {
                    id: string
                    invitation_id: string
                    event_type: string
                    metadata: Record<string, unknown> | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    invitation_id: string
                    event_type: string
                    metadata?: Record<string, unknown> | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    invitation_id?: string
                    event_type?: string
                    metadata?: Record<string, unknown> | null
                    created_at?: string
                }
            }
            tiranga_participants: {
                Row: {
                    id: string
                    first_name: string
                    city: string | null
                    dedication: string | null
                    referred_by: string | null
                    community_slug: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    first_name: string
                    city?: string | null
                    dedication?: string | null
                    referred_by?: string | null
                    community_slug?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    first_name?: string
                    city?: string | null
                    dedication?: string | null
                    referred_by?: string | null
                    community_slug?: string | null
                    created_at?: string
                }
            }
            tiranga_shares: {
                Row: {
                    share_id: string
                    first_name: string
                    city: string | null
                    dedication: string | null
                    parent_share_id: string | null
                    community_slug: string | null
                    created_at: string
                }
                Insert: {
                    share_id: string
                    first_name: string
                    city?: string | null
                    dedication?: string | null
                    parent_share_id?: string | null
                    community_slug?: string | null
                    created_at?: string
                }
                Update: {
                    share_id?: string
                    first_name?: string
                    city?: string | null
                    dedication?: string | null
                    parent_share_id?: string | null
                    community_slug?: string | null
                    created_at?: string
                }
            }
            tiranga_contacts: {
                Row: {
                    id: string
                    participant_id: string | null
                    share_id: string | null
                    phone: string
                    marketing_consent: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    participant_id?: string | null
                    share_id?: string | null
                    phone: string
                    marketing_consent?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    participant_id?: string | null
                    share_id?: string | null
                    phone?: string
                    marketing_consent?: boolean
                    created_at?: string
                }
            }
        }
    }
}

// Convenience types
export type User = Database['public']['Tables']['users']['Row']
export type Invitation = Database['public']['Tables']['invitations']['Row']
export type RSVP = Database['public']['Tables']['rsvps']['Row']
export type AnalyticsEvent = Database['public']['Tables']['analytics']['Row']
