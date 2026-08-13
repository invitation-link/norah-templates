// Authentication Utilities for Invitation Link
// Using @supabase/supabase-js directly for client-side auth
import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

// Create a browser Supabase client
export const createBrowserClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

    return createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        }
    })
}

// Singleton instance for client-side
let browserClient: ReturnType<typeof createBrowserClient> | null = null

export const getSupabaseClient = () => {
    if (!browserClient) {
        browserClient = createBrowserClient()
    }
    return browserClient
}

/**
 * Send OTP to phone number
 */
export async function sendOTP(phone: string) {
    const supabase = getSupabaseClient()

    // Format phone number with country code
    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`

    const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
    })

    if (error) {
        console.error('OTP send error:', error)
        return { success: false, error: error.message }
    }

    return { success: true }
}

/**
 * Sign in with Phone (Pseudo-Auth: Uses Phone as Email/Password)
 * This simplifies the flow by removing OTP, as requested by user constraints.
 */
export async function signInWithPseudoPhone(phone: string) {
    const supabase = getSupabaseClient()
    const email = `${phone}@invitationlink.com`
    const password = `auth-${phone}` // Prefix for basic security

    // 1. Try to Sign In
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (!signInError && signInData.session) {
        return { success: true, user: signInData.user }
    }

    // 2. If Sign In fails, try to Sign Up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { phone: phone }
        }
    })

    if (signUpError) {
        console.error('Pseudo Auth Error:', signUpError)
        return { success: false, error: signUpError.message }
    }

    // If auto-confirm is on (default for email usually), we get a session
    if (signUpData.session) {
        // Create user record
        await supabase.from('users').upsert({
            id: signUpData.user?.id,
            phone: phone,
        } as any)
        return { success: true, user: signUpData.user }
    }

    // If email confirmation is required, this might fail without session. 
    // But for this use case, we assume "Disable Email Confirm" is ON in Supabase or we accept the limitation.
    // For now, return success but warn if no session.
    return { success: true, user: signUpData.user, needsConfirmation: !signUpData.session }
}

/**
 * Verify OTP code
 */
export async function verifyOTP(phone: string, token: string) {
    const supabase = getSupabaseClient()

    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`

    const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token,
        type: 'sms',
    })

    if (error) {
        console.error('OTP verify error:', error)
        return { success: false, error: error.message, user: null }
    }

    // Create or update user in our users table
    if (data.user) {
        await supabase.from('users').upsert({
            id: data.user.id,
            phone: formattedPhone,
        } as any, {
            onConflict: 'id'
        })
    }

    return { success: true, user: data.user }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(redirectTo?: string) {
    const supabase = getSupabaseClient()

    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectTo || `${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard`,
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
