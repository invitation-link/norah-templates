import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface Props {
    params: Promise<{ slug: string }>
}

// Define invitation type for type safety
interface Invitation {
    id: string
    title: string
    slug: string
    event_name?: string
    event_date?: string
    event_time?: string
    venue?: string
    venue_address?: string
    message?: string
    views?: number
    is_published: boolean
    [key: string]: any
}

// Generate metadata for social sharing
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params

    const { data } = await (supabase.from('invitations') as any)
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

    const invitation = data as Invitation | null

    if (!invitation) {
        return { title: 'Invitation Not Found' }
    }

    return {
        title: `${invitation.title} | InviteKaro`,
        description: `You're invited to ${invitation.event_name || invitation.title} on ${invitation.event_date || 'a special day'}`,
        openGraph: {
            title: invitation.title,
            description: `Join us for ${invitation.event_name || invitation.title}`,
            type: 'website',
        },
    }
}

export default async function InvitationPage({ params }: Props) {
    const { slug } = await params

    const { data, error } = await (supabase.from('invitations') as any)
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

    const invitation = data as Invitation | null

    if (error || !invitation) {
        notFound()
    }

    // Increment view count (server-side)
    await (supabase.rpc as any)('increment_views', { invitation_slug: slug })

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50">
            <div className="max-w-lg mx-auto">
                {/* This will render the template based on template_id */}
                <div className="p-6">
                    <h1 className="text-4xl font-bold text-center text-rose-600 mb-2">
                        {invitation.title}
                    </h1>
                    <p className="text-center text-slate-600 mb-8">
                        You&apos;re invited to {invitation.event_name || invitation.title}
                    </p>

                    <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-rose-100 p-3 rounded-xl">
                                <span className="text-2xl">📅</span>
                            </div>
                            <div>
                                <p className="font-bold text-lg">{invitation.event_date || 'Date TBD'}</p>
                                <p className="text-rose-500 font-medium">{invitation.event_time || 'Time TBD'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <span className="text-2xl">📍</span>
                            </div>
                            <div>
                                <p className="font-bold">{invitation.venue || 'Venue TBD'}</p>
                                {invitation.venue_address && (
                                    <p className="text-slate-500 text-sm">{invitation.venue_address}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {invitation.message && (
                        <div className="bg-white/60 rounded-2xl p-4 mb-6 text-center">
                            <p className="text-slate-700 italic">&quot;{invitation.message}&quot;</p>
                        </div>
                    )}

                    <div className="text-center text-sm text-slate-400">
                        Views: {(invitation.views || 0) + 1}
                    </div>
                </div>
            </div>
        </div>
    )
}
