import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // FIX: Removed NEXT_PUBLIC_ to match your Vercel settings
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID; 
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    
    // FIX: Fallback to your Vercel URL if APP_URL is missing
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://trustwall-6umbjf5rr-nasreenkhalids-projects.vercel.app"; 

    if (!storeId || !variantId || !apiKey) {
      console.error("Missing Env Vars:", { storeId, variantId, apiKey: !!apiKey });
      return NextResponse.json({ error: "Missing Environment Variables" }, { status: 500 });
    }

    // 🟢 FULL PAYLOAD WITH REDIRECT
    const checkoutPayload = {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: user.email,
            custom: {
              user_id: user.id, // 🔑 Passes User ID to Webhook
            },
          },
          product_options: {
            redirect_url: `${appUrl}/dashboard`,
            receipt_button_text: "Go to Dashboard",
            receipt_link_url: `${appUrl}/dashboard`
          },
        },
        relationships: {
          store: {
            data: { type: "stores", id: storeId.toString() },
          },
          variant: {
            data: { type: "variants", id: variantId.toString() },
          },
        },
      },
    };

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
    const data = JSON.parse(rawText);
    
    if (data.errors) {
      console.error("Lemon Squeezy API Error:", data.errors);
      return NextResponse.json({ error: "API Error", details: data.errors }, { status: 422 });
    }

    return NextResponse.json({ url: data.data.attributes.url });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}