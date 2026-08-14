-- MagicInvite Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (hosts who create invitations)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(15) UNIQUE,
    name VARCHAR(100),
    email VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invitations table
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    template_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    event_name VARCHAR(200) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    venue VARCHAR(300) NOT NULL,
    venue_address TEXT,
    venue_map_url TEXT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    photos JSONB DEFAULT '[]',
    music_url TEXT,
    message TEXT,
    views INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RSVPs table
CREATE TABLE IF NOT EXISTS rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
    guest_name VARCHAR(100) NOT NULL,
    guest_phone VARCHAR(15),
    guest_email VARCHAR(255),
    attending BOOLEAN NOT NULL,
    guests_count INTEGER DEFAULT 1,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'view', 'rsvp', 'share', 'like'
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON invitations(slug);
CREATE INDEX IF NOT EXISTS idx_rsvps_invitation_id ON rsvps(invitation_id);
CREATE INDEX IF NOT EXISTS idx_analytics_invitation_id ON analytics(invitation_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Users can manage their own invitations
CREATE POLICY "Users can view own invitations" ON invitations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create invitations" ON invitations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invitations" ON invitations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invitations" ON invitations
    FOR DELETE USING (auth.uid() = user_id);

-- Public can view published invitations (for sharing)
CREATE POLICY "Public can view published invitations" ON invitations
    FOR SELECT USING (is_published = true);

-- Anyone can submit RSVPs
CREATE POLICY "Anyone can create RSVPs" ON rsvps
    FOR INSERT WITH CHECK (true);

-- Invitation owners can view RSVPs
CREATE POLICY "Owners can view RSVPs" ON rsvps
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM invitations 
            WHERE invitations.id = rsvps.invitation_id 
            AND invitations.user_id = auth.uid()
        )
    );

-- Analytics - owners can view, anyone can insert
CREATE POLICY "Anyone can log analytics" ON analytics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Owners can view analytics" ON analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM invitations 
            WHERE invitations.id = analytics.invitation_id 
            AND invitations.user_id = auth.uid()
        )
    );

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_views(invitation_slug TEXT)
RETURNS void AS $$
BEGIN
    UPDATE invitations 
    SET views = views + 1 
    WHERE slug = invitation_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate unique slug
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    new_slug TEXT;
    counter INTEGER := 0;
BEGIN
    base_slug := LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := TRIM(BOTH '-' FROM base_slug);
    new_slug := base_slug;
    
    WHILE EXISTS (SELECT 1 FROM invitations WHERE slug = new_slug) LOOP
        counter := counter + 1;
        new_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN new_slug;
END;
$$ LANGUAGE plpgsql;

-- Pass the Tiranga campaign records. These are written only through server API routes.
CREATE TABLE IF NOT EXISTS tiranga_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL CHECK (char_length(first_name) BETWEEN 1 AND 28),
    city TEXT NOT NULL CHECK (char_length(city) BETWEEN 1 AND 36),
    referred_by TEXT,
    community_slug TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tiranga_shares (
    share_id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL CHECK (char_length(first_name) BETWEEN 1 AND 28),
    city TEXT NOT NULL CHECK (char_length(city) BETWEEN 1 AND 36),
    parent_share_id TEXT REFERENCES tiranga_shares(share_id) ON DELETE SET NULL,
    community_slug TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tiranga_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID REFERENCES tiranga_participants(id) ON DELETE SET NULL,
    share_id TEXT REFERENCES tiranga_shares(share_id) ON DELETE SET NULL,
    phone TEXT NOT NULL CHECK (phone ~ '^[6-9][0-9]{9}$'),
    marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tiranga_participants_created_at ON tiranga_participants(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tiranga_participants_city ON tiranga_participants(city);
CREATE INDEX IF NOT EXISTS idx_tiranga_participants_community ON tiranga_participants(community_slug);
CREATE INDEX IF NOT EXISTS idx_tiranga_shares_parent ON tiranga_shares(parent_share_id);
CREATE INDEX IF NOT EXISTS idx_tiranga_contacts_created_at ON tiranga_contacts(created_at DESC);

ALTER TABLE tiranga_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiranga_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiranga_contacts ENABLE ROW LEVEL SECURITY;
