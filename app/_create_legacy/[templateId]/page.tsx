'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Props {
    params: { templateId: string }
}

export default function CustomizePage({ params }: Props) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        event_name: '',
        event_date: '',
        event_time: '',
        venue: '',
        venue_address: '',
        message: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/invitations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    template_id: params.templateId,
                    user_id: 'guest', // TODO: Replace with actual auth
                }),
            })

            const data = await response.json()

            if (response.ok) {
                router.push(`/create/${params.templateId}/success?slug=${data.slug}`)
            } else {
                alert('Error creating invitation: ' + data.error)
            }
        } catch (error) {
            alert('Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <Link href="/create" className="text-slate-600 font-medium flex items-center gap-2">
                            ← Back to Templates
                        </Link>
                        <span className="text-2xl font-black tracking-tighter">
                            Customize
                        </span>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8 max-w-2xl">
                <div className="bg-white rounded-3xl shadow-lg p-8">
                    <h1 className="text-3xl font-black mb-2">Customize Your Invitation</h1>
                    <p className="text-slate-600 mb-8">Fill in the details below to create your invitation</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Invitation Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Aarav's 1st Birthday"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                            />
                        </div>

                        {/* Event Name */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Event Name *
                            </label>
                            <input
                                type="text"
                                name="event_name"
                                value={formData.event_name}
                                onChange={handleChange}
                                placeholder="e.g., 1st Birthday Celebration"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                            />
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Event Date *
                                </label>
                                <input
                                    type="date"
                                    name="event_date"
                                    value={formData.event_date}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Event Time *
                                </label>
                                <input
                                    type="time"
                                    name="event_time"
                                    value={formData.event_time}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Venue */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Venue Name *
                            </label>
                            <input
                                type="text"
                                name="venue"
                                value={formData.venue}
                                onChange={handleChange}
                                placeholder="e.g., Grand Ballroom, Taj Hotel"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                            />
                        </div>

                        {/* Venue Address */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Venue Address
                            </label>
                            <input
                                type="text"
                                name="venue_address"
                                value={formData.venue_address}
                                onChange={handleChange}
                                placeholder="e.g., Road No. 2, Banjara Hills, Hyderabad"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Personal Message
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="e.g., We would be honored to have you celebrate this special day with us!"
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all resize-none"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-rose-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Invitation ✨'}
                        </button>
                    </form>
                </div>

                {/* Help */}
                <div className="text-center mt-8">
                    <p className="text-slate-500 mb-2">Need help?</p>
                    <a
                        href="https://wa.me/919553966113"
                        className="text-green-600 font-bold hover:underline"
                    >
                        💬 WhatsApp us at 9553966113
                    </a>
                </div>
            </div>
        </div>
    )
}
