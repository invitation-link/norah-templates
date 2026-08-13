import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://invite-platform-navy.vercel.app';

    // Core pages with high priority
    const coreRoutes = [
        { route: '', priority: 1.0, changeFrequency: 'weekly' as const },
        { route: '/templates', priority: 0.9, changeFrequency: 'weekly' as const },
        { route: '/create', priority: 0.9, changeFrequency: 'weekly' as const },
        { route: '/faq', priority: 0.8, changeFrequency: 'monthly' as const },
        { route: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    ].map(({ route, priority, changeFrequency }) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
    }));

    // Template category pages - high value for SEO
    const categories = [
        { slug: 'wedding', label: 'Wedding Invitations' },
        { slug: 'birthday', label: 'Birthday Invitations' },
        { slug: 'corporate', label: 'Corporate Event Invitations' },
        { slug: 'baby-shower', label: 'Baby Shower Invitations' },
        { slug: 'anniversary', label: 'Anniversary Invitations' },
        { slug: 'graduation', label: 'Graduation Invitations' },
        { slug: 'housewarming', label: 'Housewarming Invitations' },
    ];

    const categoryRoutes = categories.map((cat) => ({
        url: `${baseUrl}/templates/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
    }));

    // Template filter URLs for additional coverage
    const filterRoutes = categories.map((cat) => ({
        url: `${baseUrl}/templates?category=${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...coreRoutes, ...categoryRoutes, ...filterRoutes];
}
