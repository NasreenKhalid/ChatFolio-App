"use client";

import { useState, useEffect } from "react";

export default function EmbedCodeGenerator({ userId }: { userId: string }) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  // Get the current domain (localhost or your production URL)
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const embedUrl = `${origin}/embed/${userId}`;
  
  // The actual HTML code the user will copy
  const embedCode = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" scrolling="yes"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mt-8">
      <h3 className="text-lg font-bold text-gray-800 mb-2">📢 Embed Your Wall</h3>
      <p className="text-gray-500 text-sm mb-4">
        Copy this code and paste it anywhere on your website (WordPress, Webflow, Wix, etc.) to display your reviews.
      </p>

      <div className="relative">
        {/* The Code Box */}
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto font-mono">
          {embedCode}
        </pre>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 bg-white text-gray-900 px-3 py-1 rounded text-xs font-bold hover:bg-gray-100 transition-colors"
        >
          {copied ? "Copied! ✅" : "Copy Code"}
        </button>
      </div>
      
      {/* Preview Link */}
      <div className="mt-4 text-right">
        <a 
          href={embedUrl} 
          target="_blank" 
          rel="noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          Preview your Public Wall &rarr;
        </a>
      </div>
    </div>
  );
}