import { createClient } from "../utils/supabase/server";
import ReviewCard from "../components/ReviewCard";
import AddReviewModal from "../components/AddReviewModal";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const supabase = await createClient();
  const TEST_USER_ID = "19a76a8f-ab42-4a11-ae26-5a95e1d1f7c6"; // Keep this for now

  // 1. Fetch Reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", TEST_USER_ID) // Filter by our test user
    .order("created_at", { ascending: false });

  // 2. Fetch Profile (To get subscription status)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", TEST_USER_ID)
    .single();

  // 3. Calculate Limits
  const reviewCount = reviews?.length || 0;
  const isPro = profile?.subscription_status === "pro"; // Check your DB column value
  const limit = isPro ? 9999 : 10; // 10 for free, infinite for pro
  const isLimitReached = reviewCount >= limit;

  // Server Action
  async function refreshData() {
    "use server";
    revalidatePath("/");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm">Manage your Wall of Love</p>
          </div>
          
          {/* Pass the limit status to the component */}
          <AddReviewModal 
            userId={TEST_USER_ID} 
            onReviewAdded={refreshData}
            isLimitReached={isLimitReached} 
          />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className={`p-4 rounded-lg border ${isLimitReached ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
                <p className="text-gray-500 text-xs uppercase font-bold">Plan Usage</p>
                <p className={`text-2xl font-bold ${isLimitReached ? 'text-red-600' : 'text-gray-900'}`}>
                  {reviewCount} / {isPro ? '∞' : '10'}
                </p>
                <span className="text-xs text-gray-400 uppercase">{isPro ? 'PRO PLAN' : 'FREE PLAN'}</span>
            </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews?.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
          {reviews?.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              No reviews yet. Click "Add Review" to start!
            </div>
          )}
        </div>
      </div>
    </main>
  );
}