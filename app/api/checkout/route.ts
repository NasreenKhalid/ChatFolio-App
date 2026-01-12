import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // 1. Debugging Logs
    console.log("1. Starting Checkout Process...");
    
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Auth Error:", authError);
      return NextResponse.json({ error: "User not authenticated", details: authError }, { status: 401 });
    }
    console.log("2. User Authenticated:", user.email);

    // 2. Check Environment Variables
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID; 
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Debug log to see what is missing (only logs to server console)
    console.log("3. Checking Env Vars:", { 
      storeId: storeId ? "OK" : "MISSING", 
      variantId: variantId ? "OK" : "MISSING", 
      apiKey: apiKey ? "OK" : "MISSING" 
    });

    if (!storeId || !variantId || !apiKey) {
      // Return specific error to frontend
      return NextResponse.json({ 
        error: "Missing Lemon Squeezy Environment Variables. Check Vercel Settings.", 
        missing: {
            storeId: !!storeId,
            variantId: !!variantId,
            apiKey: !!apiKey
        }
      }, { status: 500 });
    }

    const checkoutPayload = {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: user.email,
            custom: { user_id: user.id },
          },
          product_options: {
            redirect_url: `${appUrl}/dashboard`,
            receipt_button_text: "Go to Dashboard",
            receipt_link_url: `${appUrl}/dashboard`
          },
        },
        relationships: {
          store: { data: { type: "stores", id: storeId.toString() } },
          variant: { data: { type: "variants", id: variantId.toString() } },
        },
      },
    };

    console.log("4. Sending request to Lemon Squeezy...");
    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(checkoutPayload),
    });

    const rawText = await response.text();
    let data;
    try {
        data = JSON.parse(rawText);
    } catch (e) {
        console.error("Lemon Squeezy Non-JSON Response:", rawText);
        return NextResponse.json({ error: "Lemon Squeezy returned invalid JSON", raw: rawText }, { status: 500 });
    }
    
    if (data.errors) {
      console.error("Lemon Squeezy API Error:", data.errors);
      return NextResponse.json({ error: "Lemon Squeezy API Rejected Request", details: data.errors }, { status: 422 });
    }

    console.log("5. Success! URL generated.");
    return NextResponse.json({ url: data.data.attributes.url });

  } catch (error: any) {
    // 🛑 THIS IS THE IMPORTANT FIX: Return the actual error message to frontend
    console.error("CRITICAL CHECKOUT ERROR:", error);
    return NextResponse.json({ 
        error: "Internal Server Error Triggered", 
        message: error.message, 
        stack: error.stack 
    }, { status: 500 });
  }
}