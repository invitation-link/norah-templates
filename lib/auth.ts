// Authentication Utilities for Invitation Link
// Using @supabase/supabase-js directly for client-side auth
import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import { Database } from './types'

// Create a browser Supabase client
export const createBrowserClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

    return createSupabaseBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Singleton instance for client-side
let browserClient: ReturnType<typeof createBrowserClient> | null = null

export const getSupabaseClient = () => {
    if (!browserClient) {
        browserClient = createBrowserClient()
    }
    return browserClient
}

export async function signInWithMagicLink(email: string, redirectTo?: string) {
    const supabase = getSupabaseClient()
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo || '/dashboard')}` },
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(redirectTo?: string) {
    const supabase = getSupabaseClient()

    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback?next=${encodeURIComponent(redirectTo || '/dashboard')}`,
        },
    })

    if (error) {
        console.error('Google sign in error:', error)
        return { success: false, error: error.message }
    }

    return { success: true }
}

/**
 * Sign out current user
 */
export async function signOut() {
    const supabase = getSupabaseClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error('Sign out error:', error)
        return { success: false, error: error.message }
    }

    return { success: true }
}

/**
 * Get current session
 */
export async function getSession() {
    const supabase = getSupabaseClient()

    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
        console.error('Get session error:', error)
        return null
    }

    return session
}

/**
 * Get current user
 */
export async function getCurrentUser() {
    const supabase = getSupabaseClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    return user
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: any) => void) {
    const supabase = getSupabaseClient()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
            callback(session?.user ?? null)
        }
    )

    return subscription
}
