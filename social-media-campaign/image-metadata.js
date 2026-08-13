// Image Converter Script for Social Media Campaign
// Converts PNG images to WebP format with SEO metadata

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'C:/Users/venka/.gemini/antigravity/brain/d6841a84-4a0b-443c-b4d9-a886527d1280';
const TARGET_DIR = './social-media-campaign/2026-01-13';

// Image metadata for SEO
const imageMetadata = {
    'invitation_link_logo_v2': {
        alt: 'Invitation Link Logo - Digital Invitation Platform India',
        title: 'Invitation Link - Create Stunning Digital Invitations',
        keywords: ['digital invitation', 'wedding invite', 'invitation link logo', 'online invitation maker'],
        category: 'logos',
        targetFolder: 'assets/logos'
    },
    'ig_post_wedding_invite': {
        alt: 'Digital Wedding Invitation Template - South Indian Style',
        title: 'Beautiful Digital Wedding Invitation with RSVP Tracking',
        keywords: ['wedding invitation', 'digital wedding card', 'indian wedding invite', 'shaadi card online'],
        category: 'instagram',
        targetFolder: 'instagram'
    },
    'ig_post_birthday': {
        alt: 'Birthday Party Digital Invitation - Neon Style',
        title: 'Fun Birthday Party Invitation Templates Online',
        keywords: ['birthday invitation', 'party invite', 'digital birthday card', 'birthday invitation online'],
        category: 'instagram',
        targetFolder: 'instagram'
    },
    'ig_post_photographer_collab': {
        alt: 'Wedding Photographer Partnership - Invitation Link',
        title: 'Partner with Invitation Link - Photography Business',
        keywords: ['wedding photographer', 'photographer partnership', 'wedding vendor', 'photographer collaboration'],
        category: 'instagram',
        targetFolder: 'instagram'
    },
    'ig_carousel_slide1': {
        alt: '5 Reasons Digital Invitations Beat Paper Cards',
        title: 'Why Choose Digital Invitations Over Paper',
        keywords: ['digital vs paper invites', 'eco friendly invitation', 'modern wedding invite'],
        category: 'instagram',
        targetFolder: 'instagram'
    },
    'ig_reel_cover_wedding': {
        alt: 'Wedding Invitation Reveal Animation - Tap to Open',
        title: 'Interactive Wedding Invitation Reveal',
        keywords: ['wedding invitation video', 'animated invitation', 'invitation reveal'],
        category: 'instagram',
        targetFolder: 'instagram'
    },
    'ig_story_daily_template': {
        alt: 'Instagram Story Template - Invitation Link',
        title: 'Daily Status Template for Digital Invitations',
        keywords: ['instagram story template', 'social media template', 'invitation promotion'],
        category: 'stories',
        targetFolder: 'stories'
    },
    'whatsapp_status_1': {
        alt: 'WhatsApp Status - Your Invite is Your First Impression',
        title: 'First Impression Wedding Invite Status',
        keywords: ['whatsapp status', 'wedding status', 'invitation status'],
        category: 'whatsapp',
        targetFolder: 'whatsapp'
    },
    'whatsapp_status_2': {
        alt: 'WhatsApp Status - RSVP Tracking Made Easy',
        title: 'Stop Calling Guests - Use Digital RSVP',
        keywords: ['rsvp tracking', 'guest management', 'event planning'],
        category: 'whatsapp',
        targetFolder: 'whatsapp'
    },
    'whatsapp_status_3': {
        alt: 'WhatsApp Status - Paper vs Digital Invitations Comparison',
        title: 'Paper Invites vs Digital - The Choice is Clear',
        keywords: ['paper vs digital', 'invitation cost comparison', 'free invitation'],
        category: 'whatsapp',
        targetFolder: 'whatsapp'
    },
    'invitation_link_hook_post': {
        alt: 'Make Your Invitation Magical - Invitation Link',
        title: 'Premium Digital Invitation Design',
        keywords: ['premium invitation', 'luxury wedding invite', 'magical invitation'],
        category: 'instagram',
        targetFolder: 'instagram'
    },
    'ig_launch_post': {
        alt: 'Invitation Link Launch - Create Digital Invitations in 2 Minutes',
        title: 'Invitation Link Platform Launch',
        keywords: ['invitation launch', 'digital invitation platform', 'invitation creator'],
        category: 'instagram',
        targetFolder: 'instagram'
    }
};

// Generate SEO JSON for each image
function generateSEOFile(baseName, metadata, targetPath) {
    const seoData = {
        filename: `${baseName}.webp`,
        alt: metadata.alt,
        title: metadata.title,
        keywords: metadata.keywords,
        category: metadata.category,
        dateCreated: '2026-01-13',
        platform: 'Invitation Link',
        openGraph: {
            'og:image:alt': metadata.alt,
            'og:image:type': 'image/webp'
        },
        schema: {
            '@type': 'ImageObject',
            'name': metadata.title,
            'description': metadata.alt,
            'keywords': metadata.keywords.join(', ')
        }
    };

    const seoFilePath = path.join(targetPath, `${baseName}.seo.json`);
    fs.writeFileSync(seoFilePath, JSON.stringify(seoData, null, 2));
    console.log(`Created SEO file: ${seoFilePath}`);
}

console.log('Image metadata configuration loaded.');
console.log('To convert images, run: node convert-images.js');
console.log('');
console.log('Available images:', Object.keys(imageMetadata).length);

module.exports = { imageMetadata, generateSEOFile, SOURCE_DIR, TARGET_DIR };
