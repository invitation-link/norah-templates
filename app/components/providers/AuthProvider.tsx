'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { getSupabaseClient, onAuthStateChange, signOut as authSignOut } from '@/lib/auth'
import { trackEvent } from '@/app/lib/analytics'

interface AuthContextType {
    user: User | null
    loading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => { },
})

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        const supabase = getSupabaseClient()

        supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
        const subscription = onAuthStateChange((user) => {
            setUser(user)
            setLoading(false)
            if (user) trackEvent('auth_completed', { provider: user.app_metadata?.provider || 'unknown' })
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const handleSignOut = async () => {
        await authSignOut()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, signOut: handleSignOut }}>
            {children}
        </AuthContext.Provider>
    )
}
