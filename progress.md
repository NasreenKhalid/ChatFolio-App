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







 Database password: zUrk@25rrXeA/R@

ProjectID:  ymytvixnvhzkoozpeweb

ANON api KEY: 
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlteXR2aXhudmh6a29venBld2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NjY3MzMsImV4cCI6MjA3OTU0MjczM30.3oiWPBuLJk-dffbbuY0Y4ue5i4vpKxkoRewwcYi3Um0


pROJECT url: https://ymytvixnvhzkoozpeweb.supabase.co