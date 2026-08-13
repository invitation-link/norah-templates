import Script from 'next/script';

interface JsonLdProps {
    data: Record<string, unknown> | Record<string, unknown>[];
}

export default function JsonLd({ data }: JsonLdProps) {
    const jsonLdString = JSON.stringify(data);

    return (
        <Script
            id="json-ld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLdString }}
            strategy="afterInteractive"
        />
    );
}

// Pre-built schema generators for common use cases
export const schemas = {
    // WebSite schema for homepage
    webSite: (baseUrl: string) => ({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Invite Link',
        alternateName: 'Digital Invitation Maker',
        url: baseUrl,
        description: 'Create stunning, interactive digital invitations for weddings, birthdays, and events. Free online invitation maker with WhatsApp sharing.',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${baseUrl}/templates?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    }),

    // Organization schema
    organization: (baseUrl: string) => ({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Invite Link',
        url: baseUrl,
        logo: `${baseUrl}/images/logo.png`,
        description: 'India\'s premier digital invitation platform for creating interactive, WhatsApp-friendly event invitations.',
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-9553966113',
            contactType: 'customer service',
            areaServed: 'IN',
            availableLanguage: ['English', 'Hindi'],
        },
        sameAs: [
            'https://instagram.com/invitationlink',
            'https://twitter.com/invitationlink',
        ],
    }),

    // FAQPage schema
    faqPage: (faqs: { question: string; answer: string }[]) => ({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    }),

    // HowTo schema
    howTo: (title: string, steps: string[]) => ({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: title,
        step: steps.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            text: step,
        })),
    }),

    // Product schema for templates
    product: (template: {
        name: string;
        description: string;
        image: string;
        category: string;
        url: string;
        price?: number;
    }) => ({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: template.name,
        description: template.description,
        image: template.image,
        category: template.category,
        url: template.url,
        offers: {
            '@type': 'Offer',
            price: template.price || 0,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '150',
        },
    }),

    // BreadcrumbList schema
    breadcrumb: (items: { name: string; url: string }[]) => ({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    }),

    // SoftwareApplication schema (for the platform itself)
    softwareApplication: (baseUrl: string) => ({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Invite Link',
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web Browser',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'INR',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '200',
        },
        url: baseUrl,
    }),
};
