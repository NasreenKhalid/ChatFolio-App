# Project: TrustWall (MVP)
**Type:** SaaS Side-Gig / Micro-SaaS
**Stack:** Next.js 16, Supabase, Tailwind 4, Paddle.

## Core Value Proposition
A dashboard for freelancers to manually input reviews (WhatsApp, LinkedIn, etc.) and generate a single embed code to display them as a "Wall of Love" on their portfolio sites.

## Database Schema
- **profiles:** id (auth.users), business_name, subscription_status.
- **reviews:** id, user_id, reviewer_name, review_text, star_rating, source (whatsapp, linkedin, etc.).

## Current Phase: Phase 2 (The Dashboard & Logic)
- [x] Connect to DB.
- [x] Display Review List.
- [ ] "Add Review" Form (Modal).
- [ ] Gatekeeper Logic (Limit to 10 for free users).
**Status:** Phase 2 Complete.
**Next Up:** Phase 3 (Public Widget).

## Progress Log
- [x] Project Setup (Next.js 16, Supabase, Tailwind).
- [x] Database Schema (Profiles & Reviews).
- [x] Dashboard UI (View Reviews).
- [x] Add Review Modal (Create Reviews).
- [x] Gatekeeper Logic (Limit Free users to 10).
- [x] Rebranding: Renamed to TrustWall.

## Next Steps (Tomorrow)
1. Create the API Route (`GET /api/reviews`) to fetch data for the widget.
2. Build the Embed Script that users will copy-paste.
3. Design the public-facing "Wall of Love" card.