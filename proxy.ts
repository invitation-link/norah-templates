// Next.js Proxy for route protection.
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard']
const authRoutes = ['/login', '/signup']

export async function proxy(req: NextRequest) {
    const res = NextResponse.next()
    const hasAuthCookie = req.cookies.getAll().some(cookie =>
        cookie.name.startsWith('sb-') && cookie.name.includes('-auth-token')
    )
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.some(route =>
        path === route || path.startsWith(`${route}/`)
    )
    const isAuthRoute = authRoutes.some(route => path === route)
    const authConfigured = Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    // Browsing and customization stay open. The owner dashboard is protected
    // only after real authentication credentials are connected.
    if (isProtectedRoute && authConfigured && !hasAuthCookie) {
        const redirectUrl = new URL('/', req.url)
        redirectUrl.searchParams.set('login', 'true')
        redirectUrl.searchParams.set('redirect', path)
        return NextResponse.redirect(redirectUrl)
    }

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
