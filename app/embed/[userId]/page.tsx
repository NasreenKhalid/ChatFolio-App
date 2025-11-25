import { createClient } from '../../../utils/supabase/server';
import { notFound } from 'next/navigation';

// We force this route to be dynamic since data changes per user
export const dynamic = 'force-dynamic';

export default async function EmbedPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const supabase = await createClient();

  // 1. Fetch the user's profile to make sure they exist (and maybe check subscription later)
  const { data: profile } = await supabase
    .from('profiles')
    .select('business_name')
    .eq('id', userId)
    .single();

  if (!profile) {
    return <div className="p-4 text-center text-gray-500">User not found.</div>;
  }

  // 2. Fetch the reviews for this specific user
  // Note: RLS must allow public SELECT for this to work without auth
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return <div className="p-4 text-red-500">Error loading reviews.</div>;
  }

  // 3. Render the "Wall of Love"
  // This layout is specifically designed to be embedded (no navbar, transparent bg)
  return (
    <div className="w-full min-h-screen bg-transparent p-4 font-sans">
      
      {/* Optional Header inside the widget */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-800">
          What people say about <span className="text-blue-600">{profile.business_name || 'Us'}</span>
        </h2>
      </div>

      {/* The Grid of Cards */}
      <div className="columns-1 md:columns-2 gap-4 space-y-4">
        {reviews && reviews.length > 0 ? (
          reviews.map((review: any) => (
            <div 
              key={review.id} 
              className="break-inside-avoid bg-white border border-gray-100 shadow-sm rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              {/* Star Rating */}
              <div className="flex gap-1 mb-2 text-yellow-400 text-sm">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    {i < review.star_rating ? "★" : <span className="text-gray-200">★</span>}
                  </span>
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                "{review.review_text}"
              </p>

              {/* Footer: Name & Source Badge */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                <span className="font-semibold text-gray-900 text-sm">
                  {review.reviewer_name || 'Anonymous'}
                </span>
                
                {/* Simple Badges */}
                {review.source === 'whatsapp' && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    WhatsApp
                  </span>
                )}
                {review.source === 'linkedin' && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                    LinkedIn
                  </span>
                )}
                {review.source === 'twitter' && (
                  <span className="text-xs bg-black text-white px-2 py-1 rounded-full font-medium">
                    X / Twitter
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 italic col-span-full">
            No reviews added yet.
          </p>
        )}
      </div>

      {/* Powered By TrustWall Branding (Viral Loop) */}
      <div className="mt-8 text-center">
        <a 
          href="https://trustwall.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Powered by <strong>TrustWall</strong>
        </a>
      </div>
    </div>
  );
}