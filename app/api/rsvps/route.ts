import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/rsvps?invitation_id=xxx - Get RSVPs for an invitation
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const invitation_id = searchParams.get('invitation_id')

    if (!invitation_id) {
        return NextResponse.json({ error: 'invitation_id is required' }, { status: 400 })
    }

    const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .eq('invitation_id', invitation_id)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate summary
    const rsvpData = data as any[]
    const summary = {
        total: rsvpData.length,
        attending: rsvpData.filter(r => r.attending).length,
        not_attending: rsvpData.filter(r => !r.attending).length,
        total_guests: rsvpData.filter(r => r.attending).reduce((sum, r) => sum + (r.guests_count || 1), 0)
    }

    return NextResponse.json({ rsvps: data, summary })
}

// POST /api/rsvps - Submit RSVP
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        if (!body.invitation_id || !body.guest_name || body.attending === undefined) {
            return NextResponse.json(
                { error: 'invitation_id, guest_name, and attending are required' },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from('rsvps')
            .insert({
                invitation_id: body.invitation_id,
                guest_name: body.guest_name,
                guest_phone: body.guest_phone || null,
                guest_email: body.guest_email || null,
                attending: body.attending,
                guests_count: body.guests_count || 1,
                message: body.message || null
            } as any)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Log analytics
        await supabase.from('analytics').insert({
            invitation_id: body.invitation_id,
            event_type: 'rsvp',
            metadata: { attending: body.attending, guests_count: body.guests_count }
        } as any)

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
}
