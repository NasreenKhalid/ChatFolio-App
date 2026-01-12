import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client (Service Role)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // 1. Validate the Request Signature
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) return NextResponse.json({ error: "Server config error" }, { status: 500 });

    const rawBody = await request.text();
    const signature = request.headers.get("x-signature");

    if (!signature) return NextResponse.json({ error: "No signature" }, { status: 400 });

    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signatureBuffer = Buffer.from(signature, "utf8");

    if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    // 2. Parse Event Data
    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    
    // Check for 'order_created' or 'subscription_created'
    if (eventName === "order_created" || eventName === "subscription_created") {
      // 3. Extract User ID (passed as custom_data during checkout)
      const userId = payload.meta.custom_data?.user_id;

      if (userId) {
        console.log(`✅ Payment received for User: ${userId}`);

        // 4. Update User Status in Supabase
        // FIX: Changed from { is_pro: true } to { subscription_status: 'pro' }
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({ subscription_status: 'pro' })
          .eq("id", userId);

        if (error) {
          console.error("Supabase Update Error:", error);
          return NextResponse.json({ error: "Database update failed" }, { status: 500 });
        }
        console.log(`🎉 User ${userId} upgraded to PRO`);
      } else {
        console.warn("⚠️ No user_id found in custom_data");
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (err) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}