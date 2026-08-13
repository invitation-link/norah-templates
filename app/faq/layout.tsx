import { Metadata } from 'next';
import { FAQ_CATEGORIES, getAllFAQs } from '@/app/lib/faq-data';
import JsonLd from '@/app/components/seo/JsonLd';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://invite-platform-navy.vercel.app';

export const metadata: Metadata = {
    title: 'FAQ - 100+ Questions Answered | Digital Invitation Help',
    description: 'Find answers to 100+ frequently asked questions about creating digital invitations, WhatsApp sharing, RSVP tracking, templates, pricing, and more. Get instant help with Invitation Link.',
    keywords: [
        'digital invitation FAQ',
        'how to create online invitation',
        'WhatsApp invitation help',
        'RSVP tracking questions',
        'invitation maker guide',
        'digital invite how to',
        'wedding invitation questions',
        'birthday invite help',
        'free invitation maker FAQ',
        'online invitation tutorial',
    ],
    openGraph: {
        title: 'FAQ - 100+ Questions Answered | Invitation Link',
        description: 'Comprehensive help center with answers to all your digital invitation questions.',
        url: `${baseUrl}/faq`,
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'FAQ - Digital Invitation Help | Invitation Link',
        description: '100+ answers to your invitation questions ✨',
    },
    alternates: {
        canonical: `${baseUrl}/faq`,
    },
};

// Generate FAQPage schema for all FAQs
function generateFAQSchema() {
    const allFaqs = getAllFAQs();
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: allFaqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    };
}

export default function FAQLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* FAQPage Schema for all 100 questions */}
            <JsonLd data={generateFAQSchema()} />
            {children}
        </>
    );
}
