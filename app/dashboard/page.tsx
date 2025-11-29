import { createClient } from "../../utils/supabase/server";
import ReviewCard from "../../components/ReviewCard";
import AddReviewButton from "../../components/AddReviewButton";
import EmbedCodeGenerator from "../../components/EmbedCodeGenerator";
import SignOutButton from "../../components/SignOutButton";
import { redirect } from "next/navigation";
import Footer from "../../components/Footer";
import UpgradeButton from "../../components/UpgradeButton";

// Force dynamic rendering so data is always fresh
export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const supabase = await createClient();

  // 1. Get the Real User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // 2. Fetch Reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // 3. Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // 4. Logic
  const reviewCount = reviews?.length || 0;
  const isPro = profile?.subscription_status === "pro";
  const limit = isPro ? 9999 : 10;
  const isLimitReached = reviewCount >= limit;

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      
      {/* 🟢 TOP NAVIGATION BAR */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-bold text-xl tracking-tight">TrustWall.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden md:block">
              {profile?.business_name || user.email}
            </span>
            <div className="h-4 w-px bg-gray-200 hidden md:block"></div>
            <SignOutButton />
          </div>
        </div>
      </nav>

      {/* 🟢 MAIN CONTENT */}
      <main className="max-w-6xl mx-auto py-10 px-4 space-y-8 flex-grow w-full">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your reviews and embed your wall.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Limit Indicator */}
            <div className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
              isLimitReached ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-100'
            }`}>
              {reviewCount} / {isPro ? '∞' : '10'} Reviews Used
            </div>
            
            {/* Button Component */}
            <AddReviewButton isLimitReached={isLimitReached} />
          </div>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Total Reviews */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-36 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">Total Reviews</p>
            <p className="text-4xl font-extrabold text-gray-900">{reviewCount}</p>
          </div>

          {/* Card 2: Current Plan */}
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-36">
            <div className="flex justify-between items-start">
              <p className="text-gray-500 text-sm font-medium">Current Plan</p>
              {isPro && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-bold">ACTIVE</span>}
            </div>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                {isPro ? 'PRO 🚀' : 'FREE'}
              </p>
              {!isPro && <UpgradeButton />}
            </div>
          </div>

           {/* Card 3: Widget Status (VIBRANT & ANIMATED) */}
           <a 
             href={`/embed/${user.id}`} 
             target="_blank" 
             rel="noopener noreferrer"
             className="relative overflow-hidden p-6 rounded-2xl shadow-lg flex flex-col justify-between h-36 text-white transition-all hover:scale-[1.02] cursor-pointer group"
           >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-xy bg-[length:200%_200%]"></div>
            
            {/* Glass effect overlay */}
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/5 transition-colors"></div>

            <div className="relative z-10 flex justify-between items-start">
              <p className="text-indigo-100 font-bold tracking-wide text-sm">PUBLIC WALL</p>
              <svg className="w-5 h-5 text-white opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </div>
            
            <div className="relative z-10 flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400 border-2 border-white/30"></span>
              </span>
              <p className="text-xl font-extrabold text-white text-shadow-sm">View Live Page</p>
            </div>
          </a>
        </div>

        {/* REVIEWS GRID */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Your Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews?.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
            
            {/* Empty State */}
            {reviews?.length === 0 && (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="bg-blue-50 p-4 rounded-full mb-4">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </div>
                <h3 className="text-gray-900 font-bold text-lg">No reviews yet</h3>
                <p className="text-gray-500 max-w-sm mt-1 mb-6">Add your first review manually from WhatsApp or LinkedIn.</p>
                <AddReviewButton isLimitReached={isLimitReached} />
              </div>
            )}
          </div>
        </div>

        {/* EMBED SECTION */}
        <EmbedCodeGenerator userId={user.id} />
        
      </main>
      
      <Footer />
    </div>
  );
}