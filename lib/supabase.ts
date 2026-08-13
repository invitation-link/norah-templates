// Supabase Client Configuration
import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const configuredAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Keep static builds and local visual previews available before environment
// variables are connected. Auth and data calls still require real credentials.
const supabaseUrl = configuredUrl || 'https://placeholder.supabase.co'
const supabaseAnonKey = configuredAnonKey || 'placeholder-anon-key'

export const isSupabaseConfigured = Boolean(configuredUrl && configuredAnonKey)

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Server-side client (for API routes)
export const createServerClient = () => {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!configuredUrl || !serviceRoleKey) {
        throw new Error('Supabase server credentials are not configured.')
    }

    return createClient<Database>(
        configuredUrl,
        serviceRoleKey
    )
}
