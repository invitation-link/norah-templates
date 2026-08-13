# Database Setup (Supabase)

This project relies on Supabase for data persistence (invitations, user profiles, RSVPs, and analytics).

## 1. Create a Supabase Project
1. Go to [database.new](https://database.new).
2. Create a new organization (if needed) and project.
3. Set a strong password for your database.
4. Select a region close to your primary user base (e.g., Mumbai for India).

## 2. Get API Credentials
1. Once the project fails to create (just kidding, it takes a minute), go to **Project Settings** > **API**.
2. Copy the following keys:
    - **Project URL**
    - **anon public key**
    - **service_role secret** (Keep this VERY secret!)

3. Add these to your `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## 3. Apply Usage Schema
1. Go to the **SQL Editor** in the Supabase Dashboard.
2. Click **New Query**.
3. Copy the contents of `supabase/schema.sql` from this repository.
4. Paste it into the query editor and click **Run**.

## 4. Verify Setup
- Go to the **Table Editor**.
- You should see the following tables:
    - `users`
    - `invitations`
    - `rsvps`
    - `analytics`

## 5. Enable Authentication Providers (Optional)
If you plan to allow users to sign up:
1. Go to **Authentication** > **Providers**.
2. Enable **Email/Password** (Default).
3. Enable **Google** or **Phone** if required by your app flow.
