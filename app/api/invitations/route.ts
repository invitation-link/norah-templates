import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/invitations - List user's invitations
// GET /api/invitations?slug=xxx - Get single invitation by slug
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (slug) {
        // Get single invitation by slug (public)
        const { data, error } = await supabase
            .from('invitations')
            .select('*')
            .eq('slug', slug)
            .eq('is_published', true)
            .single()

        if (error) {
            return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
        }

        // Increment view count
        await (supabase.rpc as any)('increment_views', { invitation_slug: slug })

        // Log analytics
        const inviteData = data as any
        await supabase.from('analytics').insert({
            invitation_id: inviteData.id,
            event_type: 'view',
            metadata: { referrer: request.headers.get('referer') }
        } as any)

        return NextResponse.json(data)
    }

    // List all invitations (TODO: add auth)
    const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

// POST /api/invitations - Create new invitation
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Generate slug from title
        const baseSlug = body.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')

        // Check if slug exists and add suffix if needed
        let slug = baseSlug
        let counter = 0
        while (true) {
            const { data: existing } = await supabase
                .from('invitations')
                .select('id')
                .eq('slug', slug)
                .single()

            if (!existing) break
            counter++
            slug = `${baseSlug}-${counter}`
        }

        const { data, error } = await supabase
            .from('invitations')
            .insert({
                ...body,
                slug,
                is_published: true
            } as any)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
}
