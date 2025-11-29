"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { createClient } from "../utils/supabase/client";
import StarRating from "./StarRating";
import { useRouter } from "next/navigation";

type Review = {
  id: number;
  reviewer_name: string; 
  review_text: string;
  source: string;
  star_rating: number; // 🟢 MATCHING DB COLUMN
  image_url?: string | null;
  created_at: string;
};

export default function ReviewCard({ review }: { review: Review }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // 🟢 New UI State
  
  // Local state for editing
  const [editedReview, setEditedReview] = useState({
    reviewer_name: review.reviewer_name,
    review_text: review.review_text,
    star_rating: review.star_rating || 5, 
  });

  const [isPending, startTransition] = useTransition();

  const getBadgeColor = (source: string) => {
    const s = source ? source.toLowerCase() : "other";
    switch (s) {
      case "whatsapp": return "bg-green-100 text-green-800 border-green-200";
      case "linkedin": return "bg-blue-100 text-blue-800 border-blue-200";
      case "twitter": return "bg-black text-white border-gray-800";
      case "email": return "bg-indigo-100 text-indigo-700 border-indigo-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // 🗑️ DELETE LOGIC
  const handleDelete = async () => {
    // 🟢 FIX: No more window.confirm. We show specific UI below.
    startTransition(async () => {
        const { error } = await supabase.from("reviews").delete().eq("id", review.id);
        if (error) {
            alert(`Error deleting: ${error.message}`);
        } else {
            router.refresh();
        }
    });
  };

  // 💾 UPDATE LOGIC
  const handleUpdate = async () => {
    startTransition(async () => {
        const { error } = await supabase
        .from("reviews")
        .update({
            reviewer_name: editedReview.reviewer_name,
            review_text: editedReview.review_text,
            star_rating: editedReview.star_rating, // 🟢 FIX: DB Column Name
        })
        .eq("id", review.id);

        if (error) {
            console.error("Update Error:", error);
            alert(`Update Failed: ${error.message}`);
        } else {
            setIsEditing(false);
            router.refresh();
        }
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow relative group">
      
      {/* 🔴 DELETE CONFIRMATION OVERLAY */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
           <div className="bg-red-50 p-3 rounded-full mb-3">
             <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
           </div>
           <h4 className="text-gray-900 font-bold mb-1">Delete Review?</h4>
           <p className="text-sm text-gray-500 mb-4">This action cannot be undone.</p>
           <div className="flex gap-2 w-full">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
           </div>
        </div>
      )}

      {/* 🟢 TOP ACTIONS (Hidden while editing) */}
      {!isEditing && !showDeleteConfirm && (
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white/90 p-1.5 rounded-lg shadow-sm backdrop-blur-sm border border-gray-100">
          <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-600 p-1" title="Edit">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </button>
          <div className="w-px h-4 bg-gray-200"></div>
          <button onClick={() => setShowDeleteConfirm(true)} className="text-gray-400 hover:text-red-600 p-1" title="Delete">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      )}

      {/* 🟢 IMAGE SECTION */}
      {review.image_url && (
        <div className="relative h-48 w-full bg-gray-100 border-b border-gray-100">
           <Image src={review.image_url} alt="Proof" fill className="object-cover" />
           <div className="absolute bottom-3 left-3">
             <span className={`text-[10px] font-bold px-2 py-1 rounded-md border shadow-sm uppercase tracking-wider ${getBadgeColor(review.source)}`}>
               {review.source}
             </span>
           </div>
        </div>
      )}

      {/* 🟢 CONTENT SECTION */}
      <div className="p-5 flex-grow flex flex-col gap-3">
        {!review.image_url && (
            <div className="flex justify-between items-start">
               <span className={`text-[10px] font-bold px-2 py-1 rounded-md border uppercase tracking-wider ${getBadgeColor(review.source)}`}>
                 {review.source}
               </span>
            </div>
        )}

        {isEditing ? (
          // 📝 EDIT MODE
          <div className="space-y-4 flex-grow animate-in fade-in duration-200">
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Client Name</label>
                <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={editedReview.reviewer_name}
                    onChange={(e) => setEditedReview({...editedReview, reviewer_name: e.target.value})}
                />
            </div>
            <div>
                 <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Rating</label>
                 <div className="py-1">
                   <StarRating 
                     rating={editedReview.star_rating} 
                     setRating={(r) => setEditedReview({...editedReview, star_rating: r})} 
                     editable={true} 
                   />
                 </div>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Review</label>
                <textarea 
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm h-24 focus:ring-2 focus:ring-indigo-500 outline-none resize-none leading-relaxed"
                    value={editedReview.review_text}
                    onChange={(e) => setEditedReview({...editedReview, review_text: e.target.value})}
                />
            </div>
            <div className="flex gap-2 pt-2">
                <button 
                  onClick={handleUpdate} 
                  disabled={isPending}
                  className="flex-1 bg-indigo-600 text-white text-xs font-bold py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-70 flex justify-center items-center gap-2"
                >
                    {isPending ? "Saving..." : "Save Changes"}
                </button>
                <button 
                  onClick={() => setIsEditing(false)} 
                  disabled={isPending}
                  className="flex-1 bg-gray-50 text-gray-700 border border-gray-200 text-xs font-bold py-2.5 rounded-lg hover:bg-gray-100"
                >
                    Cancel
                </button>
            </div>
          </div>
        ) : (
          // 👀 VIEW MODE
          <>
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-gray-900 line-clamp-1 text-base">{review.reviewer_name}</h3>
              <div className="flex-shrink-0">
                <StarRating rating={review.star_rating || 5} />
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
              "{review.review_text}"
            </p>
          </>
        )}
      </div>
    </div>
  );
}