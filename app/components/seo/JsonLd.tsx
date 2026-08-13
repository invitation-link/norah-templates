interface JsonLdProps {
    data: Record<string, unknown> | Record<string, unknown>[];
}

export default function JsonLd({ data }: JsonLdProps) {
    const jsonLdString = JSON.stringify(data).replace(/</g, '\\u003c');

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLdString }}
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
        description: 'Create interactive digital invitations for weddings, birthdays, housewarmings and celebrations, then share one link on WhatsApp.',
    }),

    // Organization schema
    organization: (baseUrl: string) => ({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Invite Link',
        url: baseUrl,
        logo: `${baseUrl}/brand/invite-link-lockup.png`,
        description: 'A digital invitation platform for creating interactive, WhatsApp-friendly event invitations.',
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-9553966113',
            contactType: 'customer service',
            areaServed: 'IN',
            availableLanguage: ['English', 'Hindi', 'Telugu'],
        },
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
        url: baseUrl,
    }),
    itemList: (name: string, items: { name: string; url: string; image: string }[]) => ({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name,
        itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, ...item })),
    }),
};
