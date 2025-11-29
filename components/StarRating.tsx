"use client";

import { useState } from "react";

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  editable?: boolean;
}

export default function StarRating({ rating, setRating, editable = false }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!editable} // 🟢 Only clickable if editable=true
          onClick={() => {
            if (editable && setRating) {
              setRating(star); // 🟢 This updates the state in ReviewCard
            }
          }}
          onMouseEnter={() => editable && setHoverRating(star)}
          onMouseLeave={() => editable && setHoverRating(0)}
          className={`text-lg transition-colors focus:outline-none ${
            !editable ? "cursor-default" : "cursor-pointer transform hover:scale-110"
          } ${
            star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-200"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
