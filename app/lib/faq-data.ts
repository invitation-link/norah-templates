// Comprehensive FAQ Data - 100 Questions Across 10 Categories

export interface FAQ {
    question: string;
    answer: string;
}

export interface FAQCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
    faqs: FAQ[];
}

export const FAQ_CATEGORIES: FAQCategory[] = [
    // ==================== GETTING STARTED ====================
    {
        id: 'getting-started',
        name: 'Getting Started',
        icon: '🚀',
        color: 'from-blue-500 to-cyan-500',
        faqs: [
            {
                question: 'What is Invitation Link?',
                answer: 'Invitation Link is a free online platform that lets you create beautiful, interactive digital invitations for weddings, birthdays, housewarmings, and other events. Your invitations work like mini-apps with animations, music, countdown timers, and RSVP tracking.'
            },
            {
                question: 'Is Invitation Link really free to use?',
                answer: 'Yes! Invitation Link is 100% free to use. You can create unlimited invitations, customize them with your details, and share them with as many guests as you want. Premium templates with advanced features are available for a small optional fee.'
            },
            {
                question: 'Do I need to create an account to make an invitation?',
                answer: 'You can browse templates without an account, but creating an account (which takes just 30 seconds) lets you save your invitations, track RSVPs, and access them from any device.'
            },
            {
                question: 'How long does it take to create an invitation?',
                answer: 'Most users create their perfect invitation in just 2-5 minutes. Simply choose a template, add your event details, and your invitation is ready to share!'
            },
            {
                question: 'What devices can I use to create invitations?',
                answer: 'You can create invitations on any device with a web browser - smartphones, tablets, laptops, or desktop computers. Our platform is fully responsive and works great on all screen sizes.'
            },
            {
                question: 'Do my guests need to download an app?',
                answer: 'No! Your guests don\'t need to download any app. The invitation opens directly in their web browser when they click the link. It works on all smartphones, tablets, and computers.'
            },
            {
                question: 'Can I see a demo before creating my invitation?',
                answer: 'Absolutely! You can preview any template before selecting it. Click on any template to see a live demo of how your invitation will look and feel with all the animations and interactive features.'
            },
            {
                question: 'What information do I need to create an invitation?',
                answer: 'You\'ll need basic event details: event name, date, time, venue address, and optionally your photos. You can always edit these details later before sharing.'
            },
            {
                question: 'Can I save my invitation and continue later?',
                answer: 'Yes! Your work is automatically saved as you create. Just log into your account anytime to continue editing or make changes to your invitation.'
            },
            {
                question: 'How do I get started with my first invitation?',
                answer: 'Visit our Templates page, browse by category (wedding, birthday, etc.), click on a template you like, then click "Use This Template" to start customizing with your event details.'
            },
        ]
    },

    // ==================== TEMPLATES ====================
    {
        id: 'templates',
        name: 'Templates & Designs',
        icon: '🎨',
        color: 'from-purple-500 to-pink-500',
        faqs: [
            {
                question: 'How many templates are available?',
                answer: 'We offer 50+ professionally designed templates across various categories including weddings, birthdays, housewarmings, baby showers, corporate events, and more. New templates are added regularly.'
            },
            {
                question: 'What types of event templates do you offer?',
                answer: 'We have templates for weddings (Haldi, Sangeet, Reception), birthdays (kids, adults, milestone), housewarmings (Griha Pravesh), baby showers (Godh Bharai), corporate events, anniversaries, and casual parties.'
            },
            {
                question: 'Are the templates customizable?',
                answer: 'Yes! Every template is fully customizable. You can change text, colors, fonts, add your photos, select background music, and personalize every aspect to match your event theme.'
            },
            {
                question: 'What is the difference between free and premium templates?',
                answer: 'Free templates include all essential features like customization, animations, and sharing. Premium templates offer additional features like custom music uploads, advanced animations, watermark removal, and priority support.'
            },
            {
                question: 'Can I preview a template before using it?',
                answer: 'Yes! Click on any template to see a fully interactive live demo. You can experience all animations, music, and features before deciding to use it for your event.'
            },
            {
                question: 'Do you have templates for Indian weddings?',
                answer: 'Absolutely! We specialize in Indian wedding templates including designs for Haldi, Mehendi, Sangeet, Reception, and traditional ceremonies with culturally appropriate colors, patterns, and music options.'
            },
            {
                question: 'Can I request a custom template design?',
                answer: 'Yes! Contact our team for custom design requests. We can create bespoke templates tailored to your specific theme, colors, and requirements for a nominal additional fee.'
            },
            {
                question: 'Are new templates added regularly?',
                answer: 'Yes! We add new templates every month based on trending designs, seasonal events, and user requests. Follow us on social media to stay updated on new releases.'
            },
            {
                question: 'Can I use the same template for multiple events?',
                answer: 'Absolutely! You can use any template multiple times for different events. Each invitation you create is independent, so you can customize them differently.'
            },
            {
                question: 'Do templates include animations and effects?',
                answer: 'Yes! All our templates include beautiful animations like confetti, floating elements, smooth transitions, and interactive effects that make your invitation feel premium and engaging.'
            },
            {
                question: 'Are templates mobile-friendly?',
                answer: 'All our templates are designed mobile-first and look stunning on smartphones, tablets, and desktops. Since most guests view invitations on WhatsApp, mobile optimization is our priority.'
            },
            {
                question: 'Can I change the template after starting?',
                answer: 'Yes, you can switch to a different template while keeping your event details. Just go to your dashboard, select the invitation, and choose "Change Template" to pick a new design.'
            },
        ]
    },

    // ==================== CUSTOMIZATION ====================
    {
        id: 'customization',
        name: 'Customization',
        icon: '✏️',
        color: 'from-orange-500 to-amber-500',
        faqs: [
            {
                question: 'Can I add my own photos to the invitation?',
                answer: 'Yes! You can upload your own photos to personalize your invitation. Most templates support multiple photos that display in a beautiful gallery or slideshow format.'
            },
            {
                question: 'Can I add background music to my invitation?',
                answer: 'Yes! All templates support background music. Free templates include a library of celebration songs, while premium templates allow you to upload your own custom music.'
            },
            {
                question: 'Can I change the colors of the invitation?',
                answer: 'Yes! Most templates allow you to customize the color scheme to match your event theme. You can change background colors, text colors, and accent colors.'
            },
            {
                question: 'Can I change the fonts used in the invitation?',
                answer: 'Yes! We offer a variety of beautiful fonts including traditional scripts, modern typography, and decorative styles. You can choose fonts that best represent your event\'s personality.'
            },
            {
                question: 'Can I add a countdown timer?',
                answer: 'Yes! Every invitation includes a live countdown timer that shows days, hours, and minutes until your event. Guests see this updating in real-time whenever they open the invitation.'
            },
            {
                question: 'Can I include venue location and map?',
                answer: 'Yes! Add your venue address and we\'ll include a "Get Directions" button that opens Google Maps or the guest\'s preferred navigation app for easy directions.'
            },
            {
                question: 'Can I add multiple events to one invitation?',
                answer: 'Yes! For multi-day events like weddings, you can include multiple events (Haldi, Sangeet, Reception) with different dates, times, and venues on a single invitation.'
            },
            {
                question: 'Can I write my own message or poem?',
                answer: 'Absolutely! You can add personalized messages, poems, quotes, or any text content to make your invitation uniquely yours. Express your feelings in your own words.'
            },
            {
                question: 'Can I add a dress code or theme instructions?',
                answer: 'Yes! Include dress code information, color themes, or any special instructions for your guests directly in the invitation so they come prepared.'
            },
            {
                question: 'Can I preview changes before saving?',
                answer: 'Yes! Our live preview shows you exactly how your invitation looks as you make changes. What you see is what your guests will see.'
            },
        ]
    },

    // ==================== SHARING & WHATSAPP ====================
    {
        id: 'sharing',
        name: 'Sharing & WhatsApp',
        icon: '📲',
        color: 'from-green-500 to-emerald-500',
        faqs: [
            {
                question: 'How do I share my invitation with guests?',
                answer: 'After creating your invitation, you get a unique shareable link. Share this link via WhatsApp, SMS, email, social media, or any messaging app. Just copy and paste!'
            },
            {
                question: 'Is the invitation optimized for WhatsApp?',
                answer: 'Yes! Our invitations are specifically optimized for WhatsApp. When you share the link, it displays a beautiful preview card with your event image and details, making it stand out in chats.'
            },
            {
                question: 'Can I share to WhatsApp groups?',
                answer: 'Absolutely! Your invitation link works perfectly in WhatsApp groups. All group members can open and interact with the invitation by clicking the link.'
            },
            {
                question: 'How does the WhatsApp preview look?',
                answer: 'When shared on WhatsApp, your invitation displays a rich preview with your event image, title, date, and a "View Invitation" call-to-action that encourages guests to tap and open.'
            },
            {
                question: 'Can I share on Instagram or Facebook?',
                answer: 'Yes! Your invitation link can be shared anywhere - Instagram Stories, Facebook posts, Twitter, LinkedIn, email signatures, or even printed as a QR code.'
            },
            {
                question: 'Can I create a QR code for my invitation?',
                answer: 'Yes! You can generate a QR code for your invitation link. This is perfect for printing on physical cards, posters, or displaying at venues.'
            },
            {
                question: 'How many people can I share my invitation with?',
                answer: 'There\'s no limit! Share your invitation with as many guests as you want. Our platform handles thousands of views without any issues.'
            },
            {
                question: 'Can I customize the link URL?',
                answer: 'Yes! You can customize part of your invitation URL (slug) to make it memorable and personalized, like invitationlink.com/i/priya-weds-rahul.'
            },
            {
                question: 'What happens when someone clicks my link?',
                answer: 'When guests click your link, they\'re taken directly to your beautiful, interactive invitation. It loads instantly and works on any device without app downloads.'
            },
            {
                question: 'Can I track who viewed my invitation?',
                answer: 'Yes! Your dashboard shows view counts and analytics. You can see how many people opened your invitation and when, helping you gauge guest engagement.'
            },
        ]
    },

    // ==================== RSVP & TRACKING ====================
    {
        id: 'rsvp',
        name: 'RSVP & Tracking',
        icon: '📊',
        color: 'from-indigo-500 to-violet-500',
        faqs: [
            {
                question: 'How does RSVP tracking work?',
                answer: 'When guests open your invitation, they can respond with "Yes," "No," or "Maybe." All responses are collected in your dashboard in real-time, helping you track attendance.'
            },
            {
                question: 'Can guests add the number of attendees?',
                answer: 'Yes! Guests can specify how many people are attending (e.g., "2 Adults, 1 Child"), giving you accurate headcount for planning food, seating, and arrangements.'
            },
            {
                question: 'Will I be notified when guests RSVP?',
                answer: 'Yes! You receive notifications when guests respond. Check your dashboard anytime to see the latest RSVPs and guest responses.'
            },
            {
                question: 'Can I see who has viewed the invitation?',
                answer: 'Yes! Your analytics dashboard shows total views, unique visitors, and engagement metrics. This helps you understand how many guests have seen your invitation.'
            },
            {
                question: 'Can guests change their RSVP response?',
                answer: 'Yes! Guests can update their RSVP response anytime before the event by opening the invitation again and submitting a new response.'
            },
            {
                question: 'Can I export the RSVP list?',
                answer: 'Yes! You can export your guest responses as a spreadsheet (CSV/Excel) for easy planning, printing name tags, or sharing with event coordinators.'
            },
            {
                question: 'Can guests leave a message with their RSVP?',
                answer: 'Yes! Guests can include a personal message or wishes along with their RSVP response, which you can view in your dashboard.'
            },
            {
                question: 'Is there a "Send Wishes" feature?',
                answer: 'Yes! Guests can send their blessings and wishes directly through the invitation. These are collected and displayed for you to cherish.'
            },
            {
                question: 'Can I send reminders to guests who haven\'t RSVP\'d?',
                answer: 'Yes! You can share the link again with guests who haven\'t responded. The invitation prompts them to RSVP, making it easy to get responses.'
            },
            {
                question: 'How accurate is the view count?',
                answer: 'Our view count tracks unique visits to your invitation. Each device that opens the link is counted once, giving you an accurate picture of reach.'
            },
        ]
    },

    // ==================== EVENT TYPES ====================
    {
        id: 'events',
        name: 'Event Types',
        icon: '🎉',
        color: 'from-pink-500 to-rose-500',
        faqs: [
            {
                question: 'What wedding events can I create invitations for?',
                answer: 'We have templates for all wedding functions: Engagement, Haldi, Mehendi, Sangeet, Wedding Ceremony, Reception, Cocktail Party, and destination weddings with multiple events.'
            },
            {
                question: 'Do you have birthday party templates?',
                answer: 'Yes! We offer birthday templates for all ages - 1st birthday, kids parties, sweet 16, milestone birthdays (25th, 50th, 60th), themed parties, and adult celebrations.'
            },
            {
                question: 'Can I create housewarming invitations?',
                answer: 'Absolutely! We have beautiful Griha Pravesh and housewarming templates with traditional motifs, Vastu Puja options, and modern designs for your new home celebration.'
            },
            {
                question: 'Do you have baby shower templates?',
                answer: 'Yes! We offer Godh Bharai (traditional) and modern baby shower templates with cute baby themes, gender reveal options, and celebration designs.'
            },
            {
                question: 'Can I create corporate event invitations?',
                answer: 'Yes! We have professional templates for conferences, product launches, team events, award ceremonies, office parties, and business gatherings.'
            },
            {
                question: 'Do you have anniversary templates?',
                answer: 'Yes! Celebrate love with our anniversary templates for silver jubilee (25th), golden jubilee (50th), and all milestone wedding anniversaries.'
            },
            {
                question: 'Can I create graduation party invitations?',
                answer: 'Yes! Celebrate academic achievements with our graduation templates for school, college, and post-graduate ceremonies and parties.'
            },
            {
                question: 'Do you have religious ceremony templates?',
                answer: 'Yes! We have templates for Mundan, Upanayanam, Naming Ceremony, Annaprashan, and other traditional religious celebrations.'
            },
            {
                question: 'Can I create casual party invitations?',
                answer: 'Absolutely! From house parties to game nights, potlucks to reunions, we have fun, casual templates for all types of get-togethers.'
            },
            {
                question: 'Do you have festival celebration templates?',
                answer: 'Yes! Create invitations for Diwali parties, Holi celebrations, Pongal, Onam, Christmas, New Year, and other festival gatherings.'
            },
            {
                question: 'Can I create retirement party invitations?',
                answer: 'Yes! Honor someone\'s career with our retirement party templates featuring elegant and celebratory designs.'
            },
            {
                question: 'Do you have farewell party templates?',
                answer: 'Yes! Say goodbye with style using our farewell and going-away party templates for colleagues, friends, or neighbors.'
            },
            {
                question: 'Can I create kitty party invitations?',
                answer: 'Yes! We have fun, stylish templates perfect for kitty parties with vibrant colors and playful designs.'
            },
            {
                question: 'Do you have engagement ceremony templates?',
                answer: 'Yes! Announce your engagement with our beautiful ring ceremony templates featuring romantic designs and elegant typography.'
            },
            {
                question: 'Can I create virtual event invitations?',
                answer: 'Yes! Our templates work for virtual events too. Include Zoom/Meet links and online event details for hybrid or fully virtual celebrations.'
            },
        ]
    },

    // ==================== PRICING & PREMIUM ====================
    {
        id: 'pricing',
        name: 'Pricing & Premium',
        icon: '💎',
        color: 'from-amber-500 to-yellow-500',
        faqs: [
            {
                question: 'Is Invitation Link really free?',
                answer: 'Yes! Our basic service is completely free. Create, customize, and share unlimited invitations without paying anything. Premium templates with extra features have optional paid upgrades.'
            },
            {
                question: 'What do I get with free templates?',
                answer: 'Free templates include full customization, animations, RSVP tracking, unlimited sharing, countdown timer, music from our library, and basic analytics.'
            },
            {
                question: 'What additional features do premium templates offer?',
                answer: 'Premium templates include custom music upload, advanced animations, watermark removal, priority support, extended analytics, custom URL slugs, and exclusive designs.'
            },
            {
                question: 'How much do premium templates cost?',
                answer: 'Premium templates start from ₹199 for basic upgrades. Prices vary based on features and template exclusivity. All prices are one-time with no subscriptions.'
            },
            {
                question: 'Is there a subscription required?',
                answer: 'No subscriptions! All purchases are one-time payments. Your invitation remains active forever without any recurring charges.'
            },
            {
                question: 'Can I upgrade from free to premium later?',
                answer: 'Yes! You can upgrade any free invitation to premium at any time. Your existing customizations are preserved when you upgrade.'
            },
            {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major payment methods including UPI, credit/debit cards, net banking, and wallets through our secure Razorpay payment gateway.'
            },
            {
                question: 'Is my payment information secure?',
                answer: 'Absolutely! We use Razorpay, India\'s leading payment gateway with bank-grade security. We never store your card details on our servers.'
            },
        ]
    },

    // ==================== TECHNICAL ====================
    {
        id: 'technical',
        name: 'Technical',
        icon: '⚙️',
        color: 'from-slate-500 to-gray-500',
        faqs: [
            {
                question: 'What browsers support Invitation Link?',
                answer: 'Our platform works on all modern browsers including Chrome, Safari, Firefox, Edge, and Samsung Internet. For best experience, use the latest browser version.'
            },
            {
                question: 'Does the invitation work on all phones?',
                answer: 'Yes! Our invitations work on all smartphones - iPhones, Android phones, and even older devices. They\'re optimized for mobile viewing and interaction.'
            },
            {
                question: 'Why is my invitation loading slowly?',
                answer: 'Slow loading is usually due to internet connection. Our invitations are optimized for fast loading. Try refreshing or checking your connection speed.'
            },
            {
                question: 'Can I use the invitation offline?',
                answer: 'The invitation needs an internet connection to load initially, but once loaded, most content works offline. RSVP submission requires internet.'
            },
            {
                question: 'Why isn\'t the music playing?',
                answer: 'Mobile browsers require user interaction before playing audio. Guests need to tap the invitation once, then music will play. Our templates handle this automatically.'
            },
            {
                question: 'Is there a size limit for uploaded photos?',
                answer: 'Photos are automatically optimized for web viewing. We recommend images under 5MB for best upload experience. Larger images are compressed automatically.'
            },
            {
                question: 'What audio formats are supported for custom music?',
                answer: 'We support MP3, WAV, and AAC audio formats. For best compatibility, MP3 format under 10MB is recommended for custom music uploads.'
            },
            {
                question: 'Can I access my invitation from multiple devices?',
                answer: 'Yes! Log into your account from any device to access, edit, and manage all your invitations. Your data syncs across devices automatically.'
            },
            {
                question: 'How long will my invitation link stay active?',
                answer: 'Your invitation link stays active indefinitely. Guests can access it before, during, and after your event to view details or send wishes.'
            },
            {
                question: 'What happens if I forget my password?',
                answer: 'Click "Forgot Password" on the login page. We\'ll send a reset link to your registered phone number or email to help you regain access.'
            },
        ]
    },

    // ==================== PRIVACY & SECURITY ====================
    {
        id: 'privacy',
        name: 'Privacy & Security',
        icon: '🔒',
        color: 'from-teal-500 to-cyan-500',
        faqs: [
            {
                question: 'Is my personal information safe?',
                answer: 'Yes! We take privacy seriously. Your personal data is encrypted and stored securely. We never sell or share your information with third parties.'
            },
            {
                question: 'Who can see my invitation?',
                answer: 'Only people with your invitation link can view it. It\'s not publicly listed or searchable. You control who receives and sees your invitation.'
            },
            {
                question: 'Can I make my invitation private?',
                answer: 'Yes! By default, invitations are only accessible via the direct link. For extra privacy, premium users can add password protection to their invitations.'
            },
            {
                question: 'Is guest RSVP data kept private?',
                answer: 'Yes! Only you (the invitation creator) can see who has RSVP\'d and their responses. Guests cannot see other guests\' information.'
            },
            {
                question: 'Can I delete my invitation permanently?',
                answer: 'Yes! You can delete any invitation from your dashboard. Deleted invitations are permanently removed and the link stops working.'
            },
            {
                question: 'What happens to my photos after I upload them?',
                answer: 'Your photos are stored securely on our servers and used only for your invitation. They\'re not shared or used for any other purpose. You can delete them anytime.'
            },
            {
                question: 'Do you use cookies?',
                answer: 'We use essential cookies for functionality and analytics cookies to improve our service. No personal data is collected through cookies.'
            },
            {
                question: 'Can I request my data to be deleted?',
                answer: 'Yes! Under data protection policies, you can request complete deletion of your account and all associated data. Contact our support team.'
            },
        ]
    },

    // ==================== SUPPORT & CONTACT ====================
    {
        id: 'support',
        name: 'Support & Contact',
        icon: '💬',
        color: 'from-red-500 to-orange-500',
        faqs: [
            {
                question: 'How can I contact customer support?',
                answer: 'Reach us via phone at +91 9553966113, or send a message through our website. We typically respond within 2-4 hours during business hours.'
            },
            {
                question: 'Do you offer custom invitation design services?',
                answer: 'Yes! Our design team can create completely custom invitations based on your vision. Contact us with your requirements for a personalized quote.'
            },
            {
                question: 'Can I get help with my invitation?',
                answer: 'Absolutely! Our support team is happy to help with any questions about creating, customizing, or sharing your invitation. Just reach out!'
            },
            {
                question: 'What are your support hours?',
                answer: 'Our support team is available Monday to Saturday, 9 AM to 8 PM IST. For urgent queries, you can call our support number anytime.'
            },
            {
                question: 'Do you offer bulk discounts for multiple invitations?',
                answer: 'Yes! Event planners and bulk orders get special pricing. Contact our team with your requirements for customized bulk packages.'
            },
            {
                question: 'Can I suggest new features?',
                answer: 'We love feedback! Send your feature suggestions to our team. Many of our features were added based on user requests. Your input shapes our platform.'
            },
            {
                question: 'Do you have a refund policy?',
                answer: 'Yes! If you\'re not satisfied with a premium purchase within 24 hours and haven\'t shared the invitation, contact us for a full refund.'
            },
        ]
    },
];

// Helper function to get all FAQs flattened
export const getAllFAQs = (): FAQ[] => {
    return FAQ_CATEGORIES.flatMap(category => category.faqs);
};

// Helper function to get total FAQ count
export const getTotalFAQCount = (): number => {
    return FAQ_CATEGORIES.reduce((total, category) => total + category.faqs.length, 0);
};

// Helper function to search FAQs
export const searchFAQs = (query: string): { category: FAQCategory; faq: FAQ }[] => {
    const lowerQuery = query.toLowerCase();
    const results: { category: FAQCategory; faq: FAQ }[] = [];

    FAQ_CATEGORIES.forEach(category => {
        category.faqs.forEach(faq => {
            if (
                faq.question.toLowerCase().includes(lowerQuery) ||
                faq.answer.toLowerCase().includes(lowerQuery)
            ) {
                results.push({ category, faq });
            }
        });
    });

    return results;
};
