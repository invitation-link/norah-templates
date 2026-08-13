import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/analytics - Log an analytics event
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        if (!body.invitation_id || !body.event_type) {
            return NextResponse.json(
                { error: 'invitation_id and event_type are required' },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from('analytics')
            .insert({
                invitation_id: body.invitation_id,
                event_type: body.event_type,
                metadata: body.metadata || {}
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

// GET /api/analytics?invitation_id=xxx - Get analytics for an invitation
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const invitation_id = searchParams.get('invitation_id')

    if (!invitation_id) {
        return NextResponse.json({ error: 'invitation_id is required' }, { status: 400 })
    }

    const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .eq('invitation_id', invitation_id)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate summary
    const events = data as any[]
    const summary = {
        total_views: events.filter(e => e.event_type === 'view').length,
        total_rsvps: events.filter(e => e.event_type === 'rsvp').length,
        total_shares: events.filter(e => e.event_type === 'share').length,
        total_likes: events.filter(e => e.event_type === 'like').length
    }

    return NextResponse.json({ events: data, summary })
}
