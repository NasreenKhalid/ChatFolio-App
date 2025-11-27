"use client";

import { useState } from "react";
import AddReviewModal from "./AddReviewModal";
import { useRouter } from "next/navigation";

interface AddReviewButtonProps {
  isLimitReached: boolean;
}

export default function AddReviewButton({ isLimitReached }: AddReviewButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // This function is passed to the modal to run after a successful save
  const handleSuccess = () => {
    setIsOpen(false);
    router.refresh(); // Refreshes the server data (reviews list)
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={isLimitReached}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition shadow-sm
          ${isLimitReached 
            ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
          }
        `}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        </svg>
        <span>Add Review</span>
      </button>

      {/* Render the Modal separately */}
      <AddReviewModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        // We can pass a success callback if we modify Modal, 
        // but currently the Modal calls router.refresh() internally too.
      />
    </>
  );
}