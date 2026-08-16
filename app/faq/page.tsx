'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Search, X, ChevronDown, Phone, MessageCircle } from 'lucide-react';
import { FAQ_CATEGORIES, searchFAQs, getTotalFAQCount, type FAQ, type FAQCategory } from '@/app/lib/faq-data';

// FAQ Item Component
function FAQItem({ faq, isOpen, onClick }: { faq: FAQ; isOpen: boolean; onClick: () => void }) {
    return (
        <div className="border-b border-gray-100 last:border-b-0">
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between py-5 px-4 text-left hover:bg-gray-50 transition-colors group"
            >
                <span className="font-semibold text-gray-900 pr-8 group-hover:text-purple-600 transition-colors">
                    {faq.question}
                </span>
                <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-purple-100 rotate-180' : ''}`}>
                    <ChevronDown className={`w-4 h-4 ${isOpen ? 'text-purple-600' : 'text-gray-500'}`} />
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}>
                <p className="px-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                </p>
            </div>
        </div>
    );
}

// Category Section Component
function CategorySection({ category, openIndex, setOpenIndex }: {
    category: FAQCategory;
    openIndex: number | null;
    setOpenIndex: (index: number | null) => void;
}) {
    return (
        <div id={category.id} className="scroll-mt-32">
            <div className={`bg-gradient-to-r ${category.color} rounded-2xl p-6 mb-4`}>
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{category.icon}</span>
                    <div>
                        <h2 className="text-xl font-bold text-white">{category.name}</h2>
                        <p className="text-white/80 text-sm">{category.faqs.length} questions</p>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                {category.faqs.map((faq, index) => (
                    <FAQItem
                        key={index}
                        faq={faq}
                        isOpen={openIndex === index}
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    />
                ))}
            </div>
        </div>
    );
}

// Search Results Component
function SearchResults({ results, query }: { results: { category: FAQCategory; faq: FAQ }[]; query: string }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    if (results.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500">Try different keywords or browse categories below</p>
            </div>
        );
    }

    return (
        <div className="mb-8">
            <p className="text-gray-500 mb-4">{results.length} results for "{query}"</p>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {results.map((result, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-b-0">
                        <div className="px-4 pt-3">
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${result.category.color} text-white`}>
                                {result.category.icon} {result.category.name}
                            </span>
                        </div>
                        <FAQItem
                            faq={result.faq}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [openIndices, setOpenIndices] = useState<Record<string, number | null>>({});

    const totalFAQs = getTotalFAQCount();

    const searchResults = useMemo(() => {
        if (searchQuery.length < 2) return [];
        return searchFAQs(searchQuery);
    }, [searchQuery]);

    const isSearching = searchQuery.length >= 2;

    const handleCategoryClick = (categoryId: string) => {
        setActiveCategory(categoryId);
        setSearchQuery('');
        const element = document.getElementById(categoryId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
            {/* Fixed Navbar */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-black/5 py-4">
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

            {/* Hero Section */}
            <section className="pt-32 pb-12 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-6">
                        <span>📚</span> {totalFAQs} Questions Answered
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
                        Frequently Asked{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            Questions
                        </span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">
                        Everything you need to know about creating stunning digital invitations.
                        Can't find an answer? Contact our support team.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-4 flex items-center"
                            >
                                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Category Pills */}
            {!isSearching && (
                <section className="sticky top-[73px] z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4">
                    <div className="container mx-auto px-6">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {FAQ_CATEGORIES.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.id)}
                                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category.id
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <span>{category.icon}</span>
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Main Content */}
            <main className="py-12 px-6">
                <div className="container mx-auto max-w-4xl">
                    {isSearching ? (
                        <SearchResults results={searchResults} query={searchQuery} />
                    ) : (
                        FAQ_CATEGORIES.map((category) => (
                            <CategorySection
                                key={category.id}
                                category={category}
                                openIndex={openIndices[category.id] ?? null}
                                setOpenIndex={(index) => setOpenIndices(prev => ({ ...prev, [category.id]: index }))}
                            />
                        ))
                    )}
                </div>
            </main>

            {/* Contact CTA */}
            <section className="py-16 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white">
                        <div className="text-5xl mb-4">🤔</div>
                        <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
                        <p className="text-white/80 mb-8 max-w-xl mx-auto">
                            Can't find what you're looking for? Our support team is here to help you
                            create the perfect invitation for your special occasion.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href="tel:+919553966113"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:scale-105 transition-transform"
                            >
                                <Phone className="w-5 h-5" />
                                Call Us Now
                            </a>
                            <a
                                href="https://wa.me/919553966113?text=Hi!%20I%20have%20a%20question%20about%20Invitation%20Link"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
                            >
                                <MessageCircle className="w-5 h-5" />
                                WhatsApp Us
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-6 text-center">
                    <Link href="/" className="text-2xl font-black tracking-tighter flex items-center justify-center gap-2 mb-4">
                        <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black">
                            <Sparkles size={18} />
                        </span>
                        Invitation Link
                    </Link>
                    <p className="text-gray-400 text-sm mb-6">
                        Create stunning digital invitations for all your celebrations
                    </p>
                    <div className="flex justify-center gap-6 text-sm">
                        <Link href="/templates" className="text-gray-400 hover:text-white transition-colors">Templates</Link>
                        <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
                        <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link>
                    </div>
                    <p className="text-gray-500 text-xs mt-8">
                        © 2026 Invite Link. Made in India. · <Link href="/pricing">Pricing</Link> · <Link href="/contact">Contact</Link> · <Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link> · <Link href="/refund">Refunds</Link>
                    </p>
                </div>
            </footer>
        </div>
    );
}
