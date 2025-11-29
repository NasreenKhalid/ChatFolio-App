import { createClient } from '@supabase/supabase-js';

// Note: You must add SUPABASE_SERVICE_ROLE_KEY to your .env.local file
// This key has full admin access to your DB. Never expose it on the client!
export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};
