'use client'

import { useState } from 'react'
import Link from 'next/link'

const TEMPLATES = [
    { id: 'birthday-1', category: 'Birthday', title: "Kid's Birthday", image: 'https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?auto=format&fit=crop&q=80&w=600', price: 'Free' },
    { id: 'wedding-1', category: 'Wedding', title: 'Royal Heritage', image: 'https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?auto=format&fit=crop&q=80&w=600', price: 'Free' },
    { id: 'housewarming-1', category: 'Housewarming', title: 'Griha Pravesh', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600', price: 'Free' },
    { id: 'baby-shower-1', category: 'Baby Shower', title: 'Little Angel', image: 'https://images.unsplash.com/photo-1544126566-475a8971d95e?auto=format&fit=crop&q=80&w=600', price: 'Free' },
    { id: 'anniversary-1', category: 'Anniversary', title: 'Golden Years', image: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&q=80&w=600', price: '₹499' },
    { id: 'engagement-1', category: 'Engagement', title: 'Ring Ceremony', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600', price: '₹499' },
    { id: 'corporate-1', category: 'Corporate', title: 'Office Party', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600', price: '₹999' },
    { id: 'wedding-2', category: 'Wedding', title: 'South Indian', image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=600', price: 'Free' },
]

const CATEGORIES = ['All', 'Birthday', 'Wedding', 'Housewarming', 'Baby Shower', 'Anniversary', 'Engagement', 'Corporate']

export default function CreatePage() {
    const [selectedCategory, setSelectedCategory] = useState('All')

    const filteredTemplates = selectedCategory === 'All'
        ? TEMPLATES
        : TEMPLATES.filter(t => t.category === selectedCategory)

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
                            <span className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">✨</span>
                            MagicInvite
                        </Link>
                        <a href="tel:+919553966113" className="bg-rose-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                            📞 Help
                        </a>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="bg-gradient-to-br from-rose-500 to-purple-600 text-white py-16">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Choose Your Template</h1>
                    <p className="text-xl opacity-90">Pick a design, customize it, and share in minutes!</p>
                </div>
            </section>

            {/* Category Filter */}
            <section className="bg-white border-b py-4 sticky top-16 z-40">
                <div className="container mx-auto px-6">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                                        ? 'bg-rose-500 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Template Grid */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredTemplates.map(template => (
                            <Link
                                key={template.id}
                                href={`/create/${template.id}`}
                                className="group cursor-pointer"
                            >
                                <div className="aspect-[3/4] rounded-2xl overflow-hidden relative mb-4 shadow-lg">
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-10 flex items-center justify-center">
                                        <span className="opacity-0 group-hover:opacity-100 bg-white px-6 py-3 rounded-full font-bold transition-opacity">
                                            Use Template →
                                        </span>
                                    </div>
                                    <img
                                        src={template.image}
                                        alt={template.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">
                                        {template.price}
                                    </div>
                                    <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {template.category}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold leading-tight group-hover:text-rose-600 transition-colors">
                                    {template.title}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-slate-900 text-white py-12">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold mb-4">Need a Custom Design?</h2>
                    <p className="text-slate-400 mb-6">We create unique, one-of-a-kind invitations for you</p>
                    <a
                        href="https://wa.me/919553966113?text=Hi!%20I%20need%20a%20custom%20invitation%20design"
                        className="inline-flex items-center gap-2 bg-green-500 px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                    >
                        💬 WhatsApp Us
                    </a>
                </div>
            </section>
        </div>
    )
}
