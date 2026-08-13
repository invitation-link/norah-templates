import { Metadata } from 'next';
import JsonLd, { schemas } from '@/app/components/seo/JsonLd';
import { SITE_URL } from '@/app/lib/site';

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
        url: `${SITE_URL}/faq`,
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'FAQ - Digital Invitation Help | Invitation Link',
        description: '100+ answers to your invitation questions ✨',
    },
    alternates: {
        canonical: `${SITE_URL}/faq`,
    },
};

export default function FAQLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <JsonLd data={schemas.breadcrumb([{ name: 'Home', url: SITE_URL }, { name: 'FAQ', url: `${SITE_URL}/faq` }])} />
            {children}
        </>
    );
}
