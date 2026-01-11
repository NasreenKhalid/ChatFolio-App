import { createClient } from "@/utils/supabase/server";
import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

export async function POST(request: Request) {
  try {
    // 1. Setup Lemon Squeezy
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;
    
    // DEBUG LOGS (Check Vercel Logs to see if these print)
    console.log("Debug - Env Check:", {
      hasApiKey: !!apiKey,
      storeId: storeId,
      variantId: variantId,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL
    });

    if (!apiKey || !storeId || !variantId) {
      console.error("Missing Lemon Squeezy Env Vars");
      return new Response("Server Config Error: Missing Env Vars", { status: 500 });
    }

    lemonSqueezySetup({ apiKey });

    // 2. Get User
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 3. Create Checkout
    console.log("Creating checkout for user:", user.id);
    
    // Ensure Base URL is set, fallback to origin if needed
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://trustwall.vercel.app"; // Update this fallback to your real URL if needed

    const checkout = await createCheckout(
      storeId, 
      variantId, 
      {
        checkoutData: {
          email: user.email,
          custom: {
            user_id: user.id,
          },
        },
        productOptions: {
          enabledVariants: [parseInt(variantId, 10)], // cast to number safely
          redirectUrl: `${baseUrl}/success`,
          receiptButtonText: "Go to Dashboard",
          receiptThankYouNote: "Thank you for joining TrustWall Pro!",
        },
      }
    );

    console.log("Checkout created:", checkout.data?.data?.attributes?.url);

    // 4. Return URL
    return Response.json({ url: checkout.data?.data?.attributes?.url });

  } catch (error: any) {
    // THIS IS THE IMPORTANT PART
    console.error("LEMON SQUEEZY ERROR FULL DUMP:", JSON.stringify(error, null, 2));
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}