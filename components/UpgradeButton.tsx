"use client";

import { useState } from "react";

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // Call our API to create a secure checkout link
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      
      if (data.url) {
        // Redirect the user to Lemon Squeezy to pay
        window.location.href = data.url;
      } else {
        alert("Could not initialize checkout. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error processing request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleUpgrade}
      disabled={loading}
      className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition shadow-lg shadow-slate-200 disabled:opacity-70 flex items-center gap-2"
    >
      {loading ? (
        <>
          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          Processing...
        </>
      ) : (
        "Upgrade to Pro 🚀"
      )}
    </button>
  );
}