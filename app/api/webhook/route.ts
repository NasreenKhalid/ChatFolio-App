import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    // 1. Validate Signature
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "";
    if (!secret) return new Response("Secret missing", { status: 500 });

    const hmac = crypto.createHmac("sha256", secret);
    const rawBody = await request.text();
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signature = Buffer.from(
      (await headers()).get("x-signature") || "",
      "utf8"
    );

    if (!crypto.timingSafeEqual(digest, signature)) {
      return new Response("Invalid signature", { status: 400 });
    }

    // 2. Parse Data
    const payload = JSON.parse(rawBody);
    const { meta, data } = payload;
    const eventName = meta.event_name;
    const userId = meta.custom_data?.user_id;

    console.log("Webhook received:", eventName, "for user:", userId);

    // 3. Update Database (Using SERVICE ROLE key to bypass RLS)
    if ((eventName === "order_created" || eventName === "subscription_created") && userId) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! 
      );

      const { error } = await supabase
        .from("profiles")
        .update({ 
            subscription_status: "pro", 
            lemon_squeezy_customer_id: data.attributes.customer_id 
        })
        .eq("user_id", userId);

      if (error) {
        console.error("DB Update Error:", error);
        return new Response("DB Error", { status: 500 });
      }
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return new Response("Server Error", { status: 500 });
  }
}