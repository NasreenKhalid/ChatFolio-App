"use client";

import { createClient } from "../utils/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // Refresh current route
    router.push("/login"); // Go to login
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
    >
      Sign Out
    </button>
  );
}