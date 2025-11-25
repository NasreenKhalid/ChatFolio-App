#TrustWall Progress Log
- **Date:** Nov 23, 2025
- **Phase:** Phase 1 (Foundation) - IN PROGRESS
- **Tech Stack:** Next.js 16, React 19, Tailwind 4.
- **Completed:**
  - Project initialized (`npx create-next-app`).
  - Cleaned up `page.tsx`.
  - Installed dependencies: `npm install @supabase/supabase-js @supabase/ssr`.
- **Current Blocker:** Supabase "Create Project" glitch.
- **Next Step:**
  1. Retry creating Supabase Project.
  2. Get API URL/Anon Key.
  3. Create `.env.local` file.
  4. Write the Supabase Client utility code.
  - **Date:** Nov 24, 2025
- **Phase:** Phase 2 (Dashboard & Logic) - COMPLETED
- **Tech Stack:** Next.js 16, React 19, Tailwind 4, Supabase.

- **Completed Features:**
  - [x] **Foundation:** Connected Supabase (Server & Client utils configured).
  - [x] **Database:** Created `profiles` and `reviews` tables with RLS policies.
  - [x] **Dashboard UI:** Displays list of reviews with specific styling (WhatsApp/LinkedIn badges).
  - [x] **Add Review:** Created `AddReviewModal.tsx` for manual data entry.
  - [x] **Gatekeeper:** Implemented logic to limit Free users to 10 reviews.
  - [x] **Rebranding:** Project renamed from "Chatfolio" to "TrustWall".

- **Current Status:**
  - The Dashboard is fully functional.
  - Users can view and add reviews.
  - "Pro" vs "Free" logic is active (checked via `subscription_status` in DB).

- **Next Steps (Phase 3 - The Public Widget):**
  1. Create API Route (`app/api/reviews/route.ts`) to serve public data.
  2. Build the Embed Script logic (so users can copy-paste to their sites).
  3. Design the public-facing "Wall of Love" card component.


Date: Nov 25, 2025
Phase: Phase 3 (Public Widget & Auth) - COMPLETED
Tech Stack: Next.js 16, Supabase Auth, Tailwind 4.
Completed Features:

Public Widget Page: Created the dynamic route /embed/[userId] that displays reviews publicly without auth.

Embed Code Generator: Built a component that generates the specific <iframe> code for users to copy.

Authentication System:
Implemented Login and Signup pages with Server Actions.
Added Business Name field to signup flow.
Created Auth Callback route (/auth/callback) to handle email verification links.

Database Automation:
Added SQL Triggers to automatically create a profiles row when a new user signs up.
Updated RLS policies to allow public reading of reviews and profiles.

Dashboard Overhaul:
Replaced the simple list with a "Pro" dashboard layout.
Added Top Navbar, Stats Cards, and "Empty State" UI.
Added Logout functionality.
File Inventory (Today's Work):
1. Public Widget & Logic
app/embed/[userId]/page.tsx (The public "Wall of Love" page).
components/EmbedCodeGenerator.tsx (The UI to copy the iframe code).
2. Authentication
app/login/page.tsx (Split-screen login UI).
app/login/actions.ts (Server actions for login).
app/signup/page.tsx (Dedicated signup UI with Business Name).
app/signup/actions.ts (Server actions for signup).
app/auth/callback/route.ts (API route to handle Supabase email links).
components/SignOutButton.tsx (Logout button).
3. Infrastructure
app/page.tsx (The main Dashboard, completely rewritten).
utils/supabase/server.ts (Server-side Supabase client).
utils/supabase/client.ts (Client-side Supabase client).
4. Database (SQL Run)
Trigger: handle_new_user (Auto-creates profile on signup).
RLS: Enabled public read access for reviews and profiles.
Next Steps (Tomorrow):
Brand Identity: Create a proper Logo and Navbar design.
UI Polish: Consistent fonts, refined colors, and mobile responsiveness check.
Landing Page: (Optional) Start thinking about the home page (/) for visitors who aren't logged in.




 Database password: zUrk@25rrXeA/R@

ProjectID:  ymytvixnvhzkoozpeweb

ANON api KEY: 
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlteXR2aXhudmh6a29venBld2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NjY3MzMsImV4cCI6MjA3OTU0MjczM30.3oiWPBuLJk-dffbbuY0Y4ue5i4vpKxkoRewwcYi3Um0


pROJECT url: https://ymytvixnvhzkoozpeweb.supabase.co