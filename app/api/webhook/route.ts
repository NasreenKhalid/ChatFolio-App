import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "../../../utils/supabase/admin";

export async function POST(req: Request) {
  try {
    const text = await req.text(); // Read raw body for signature verification
    const hmac = crypto.createHmac(
      "sha256",
      process.env.LEMONSQUEEZY_WEBHOOK_SECRET!
    );
    const digest = Buffer.from(hmac.update(text).digest("hex"), "utf8");
    const signature = Buffer.from(
      req.headers.get("x-signature") || "",
      "utf8"
    );

    // 1. Verify Signature (Security Check)
    if (!crypto.timingSafeEqual(digest, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(text);
    const eventName = payload.meta.event_name;
    const data = payload.data;
    const attributes = data.attributes;
    
    // We extracted the user_id we sent in the checkout payload here
    const userId = payload.meta.custom_data?.user_id;

    console.log(`🔔 Webhook received: ${eventName} for User ${userId}`);

    // 2. Initialize Admin Client
    const supabaseAdmin = createAdminClient();

    // 3. Handle Subscription Created
    if (eventName === "subscription_created") {
      if (!userId) {
        return NextResponse.json({ error: "No User ID found in webhook" }, { status: 400 });
      }

      // Update User Profile to PRO
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({
          subscription_status: "active", // Or 'pro'
          lemon_squeezy_customer_id: attributes.customer_id,
          lemon_squeezy_subscription_id: data.id,
          variant_id: attributes.variant_id,
        })
        .eq("id", userId);

      if (error) {
        console.error("Database update failed:", error);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }
      
      console.log(`✅ User ${userId} upgraded to PRO.`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}