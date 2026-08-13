import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Heart, Globe, Zap, Users } from 'lucide-react';
import JsonLd, { schemas } from '@/app/components/seo/JsonLd';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://invite-platform-navy.vercel.app';

export const metadata: Metadata = {
    title: 'About Us - Our Story',
    description: 'Learn about Invitation Link - India\'s premier digital invitation platform. We make creating beautiful, interactive invitations easy, eco-friendly, and free for everyone.',
    keywords: [
        'about invitation link',
        'digital invitation company',
        'online invitation maker India',
        'eco-friendly invitations',
    ],
    openGraph: {
        title: 'About Invitation Link',
        description: 'India\'s premier digital invitation platform. Beautiful invitations, free forever.',
    },
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* JSON-LD Structured Data */}
            <JsonLd data={schemas.organization(baseUrl)} />

            {/* Header */}
            <nav className="fixed w-full z-40 bg-white/80 backdrop-blur-xl border-b border-black/5 py-4">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
                        <span className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
                            <Sparkles size={18} />
                        </span>
                        Invitation Link
                    </Link>
                    <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-4xl">
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
                            Invitations That{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                                Spark Joy
                            </span>
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                            We believe every celebration deserves an invitation that's as special as the event itself.
                            That's why we created Invitation Link.
                        </p>
                    </div>

                    {/* Story */}
                    <div className="prose prose-lg max-w-none mb-16">
                        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Invitation Link started with a simple observation: traditional paper invitations are beautiful,
                                but they don't fit our digital lives. Sending a PDF over WhatsApp feels impersonal, and
                                creating a fancy invitation shouldn't require design skills or expensive software.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                We set out to solve this by creating a platform where anyone can craft stunning,
                                interactive invitations in minutes. Invitations that come alive with music, animations,
                                and countdown timers. Invitations that look perfect when shared on WhatsApp, the way
                                Indians actually communicate.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Today, thousands of families across India use Invitation Link for their weddings,
                                birthdays, housewarmings, and celebrations. We're proud to be part of their special moments.
                            </p>
                        </div>
                    </div>

                    {/* Values */}
                    <div className="grid md:grid-cols-2 gap-6 mb-16">
                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8 border border-pink-100">
                            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mb-4">
                                <Heart className="w-6 h-6 text-pink-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Made with Love</h3>
                            <p className="text-gray-600">Every template is crafted with attention to detail, cultural nuances, and the emotions behind celebrations.</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100">
                            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                                <Globe className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Eco-Friendly</h3>
                            <p className="text-gray-600">Digital invitations mean zero paper waste. Celebrate responsibly without compromising on beauty.</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-3xl p-8 border border-purple-100">
                            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Instant & Easy</h3>
                            <p className="text-gray-600">Create and share in minutes, not days. No design skills required. No app downloads needed.</p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 border border-orange-100">
                            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Free Forever</h3>
                            <p className="text-gray-600">Basic invitations are always free. We believe everyone deserves beautiful invitations regardless of budget.</p>
                        </div>
                    </div>

                    {/* Contact CTA */}
                    <div className="text-center bg-gray-900 rounded-3xl p-12 text-white">
                        <h2 className="text-3xl font-bold mb-4">Let's Create Together</h2>
                        <p className="text-white/70 mb-8 max-w-xl mx-auto">
                            Have questions or custom requirements? We'd love to hear from you.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href="tel:+919553966113"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:scale-105 transition-transform"
                            >
                                📞 +91 9553966113
                            </a>
                            <Link
                                href="/templates"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full hover:scale-105 transition-transform"
                            >
                                Browse Templates →
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-100 py-12 text-center">
                <div className="container mx-auto px-6">
                    <p className="text-gray-500 text-sm">
                        © 2026 Invitation Link. Made with ❤️ in India.
                    </p>
                </div>
            </footer>
        </div>
    );
}
