import { createClient } from "../../../utils/supabase/server";
import Image from "next/image";
import { notFound } from "next/navigation";

// Force dynamic rendering so it doesn't cache stale data
export const dynamic = "force-dynamic";

export default async function PublicWall({ params }: { params: { userId: string } }) {
  // Await params (Next.js 16+ requirement)
  const { userId } = await params;
  const supabase = await createClient();

  // 1. Fetch Profile (REMOVED 'email' to fix the crash)
  const { data: profile } = await supabase
    .from("profiles")
    .select("business_name") // <--- Fixed line
    .eq("id", userId)
    .single();

  // If profile doesn't exist or RLS blocks it, return 404
  if (!profile) return notFound();

  // 2. Fetch Reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  // Helper for stars
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={`text-lg ${i < rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
    ));
  };

  // Helper for badge color
  const getBadgeColor = (source: string) => {
    const s = source ? source.toLowerCase() : "other";
    switch (s) {
      case "whatsapp": return "bg-green-100 text-green-700";
      case "linkedin": return "bg-blue-100 text-blue-700";
      case "twitter": return "bg-black text-white";
      case "email": return "bg-indigo-100 text-indigo-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-20">
        
        {/* HEADER */}
        <div className="text-center mb-16 animate-in slide-in-from-bottom-4 fade-in duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">Wall of Love</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            {profile.business_name || "Client Reviews"}
          </h1>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-lg">
            See what people are saying about working with us.
          </p>
        </div>

        {/* MASONRY GRID (Pinterest Style) */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {reviews?.map((review, index) => (
            <div 
              key={review.id} 
              className="break-inside-avoid bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Header: Name & Badge */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                    {review.reviewer_name ? review.reviewer_name.charAt(0) : "?"}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{review.reviewer_name || "Anonymous"}</h3>
                    <div className="flex text-yellow-400 text-xs mt-0.5">{renderStars(review.rating || 5)}</div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${getBadgeColor(review.source)}`}>
                  {review.source || "Review"}
                </span>
              </div>

              {/* Review Text */}
              <p className="text-slate-600 leading-relaxed text-sm mb-4">
                "{review.review_text}"
              </p>

              {/* Optional Image */}
              {review.image_url && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden mt-4 border border-slate-100 group cursor-zoom-in">
                  <Image 
                    src={review.image_url} 
                    alt="Review proof" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Date */}
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                <span>Verified Review</span>
                <span>{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {reviews?.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">No reviews yet</h3>
              <p className="text-slate-500">This wall is waiting for its first story.</p>
            </div>
          )}
        </div>

        {/* Footer Watermark */}
        <div className="mt-20 text-center">
          <a href="/" target="_blank" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-indigo-600 transition-colors">
            <span className="opacity-70">Powered by</span>
            <span className="font-bold text-slate-600">TrustWall</span>
          </a>
        </div>
      </div>
    </div>
  );
}