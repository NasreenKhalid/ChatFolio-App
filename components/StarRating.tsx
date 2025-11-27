"use client";

import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md";
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  readOnly = false,
  size = "md" 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hoverRating || rating) >= star;
        const starSize = size === "md" ? "w-6 h-6" : "w-4 h-4";
        
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onRatingChange && onRatingChange(star)}
            onMouseEnter={() => !readOnly && setHoverRating(star)}
            className={`${readOnly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isFilled ? "#FBBF24" : "none"} // Amber-400
              stroke={isFilled ? "#FBBF24" : "#CBD5E1"} // Slate-300
              strokeWidth={2}
              className={starSize}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}