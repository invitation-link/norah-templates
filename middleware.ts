// Next.js Middleware for Route Protection
// Using simple cookie-based session check
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = ['/dashboard']

// Routes that should redirect to dashboard if logged in
const authRoutes = ['/login', '/signup']

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()

    // Check for Supabase auth cookie
    // The cookie name is sb-{project-ref}-auth-token
    const hasAuthCookie = req.cookies.getAll().some(cookie =>
        cookie.name.startsWith('sb-') && cookie.name.includes('-auth-token')
    )

    const path = req.nextUrl.pathname

    // Check if current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route =>
        path === route || path.startsWith(`${route}/`)
    )

    // Check if current path is an auth route
    const isAuthRoute = authRoutes.some(route => path === route)

    const authConfigured = Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    // Browsing and customization stay open. The owner dashboard is protected
    // only after real authentication credentials are connected.
    if (isProtectedRoute && authConfigured && !hasAuthCookie) {
        // Store the intended destination
        const redirectUrl = new URL('/', req.url)
        redirectUrl.searchParams.set('login', 'true')
        redirectUrl.searchParams.set('redirect', path)
        return NextResponse.redirect(redirectUrl)
    }

    // If logged in and trying to access auth routes, redirect to dashboard
    if (isAuthRoute && hasAuthCookie) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return res
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/login',
        '/signup',
    ],
}
