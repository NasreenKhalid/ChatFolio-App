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

    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ID;
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;

    if (!storeId || !variantId || !apiKey) {
      return NextResponse.json({ error: "Missing Environment Variables" }, { status: 500 });
    }

    // 🟢 FULL PAYLOAD WITH REDIRECT
    const checkoutPayload = {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: user.email,
            // 🔑 CRITICAL: This passes the User ID to the webhook later
            custom: {
              user_id: user.id, 
            },
          },
          product_options: {
            // Where to send them after payment (Dashboard)
            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`, 
            receipt_button_text: "Go to Dashboard",
            receipt_link_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
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