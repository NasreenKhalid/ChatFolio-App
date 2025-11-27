"use client";

import React, { useState } from "react";
import { createClient } from "../utils/supabase/client";
import { useRouter } from "next/navigation";
import StarRating from "./StarRating";
import AddReviewModal from "./AddReviewModal"; 

interface Review {
  id: number;
  reviewer_name: string;
  review_text: string;
  star_rating: number;
  source: string;
  image_url?: string | null;
  created_at?: string;
}

export default function ReviewCard({ review }: { review: Review }) {
  const router = useRouter();
  const supabase = createClient();
  
  // State
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // <--- NEW: Controls local visibility

  // Fallbacks
  const name = review.reviewer_name || "Anonymous";
  const content = review.review_text || "";
  const rating = review.star_rating || 5;

  const handleDelete = async () => {
    setIsDeleting(true);
    
    // 1. Perform Delete in DB
    const { error } = await supabase.from("reviews").delete().eq("id", review.id);
    
    if (error) {
      console.error(error);
      alert("Failed to delete. Please check your internet or permissions.");
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    } else {
      // 2. Success! Hide the card immediately (Instant UI feedback)
      setIsVisible(false); 
      setIsDeleteModalOpen(false);
      
      // 3. Refresh the Server (Updates the 'Total Reviews' count)
      router.refresh(); 
    }
  };

  // If hidden (deleted), return nothing
  if (!isVisible) return null;

  return (
    <>
    <div className="group relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full animate-in fade-in zoom-in duration-300">
      
      {/* HEADER ROW */}
      <div className="flex justify-between items-start mb-4 gap-4">
        
        <div className="flex items-start gap-4">
          {/* Avatar */}
          {review.image_url ? (
            <img 
              src={review.image_url} 
              alt={name} 
              className="w-16 h-16 rounded-xl object-cover aspect-square border border-slate-100 shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-2xl shadow-inner border border-indigo-50 aspect-square">
              {name.charAt(0)}
            </div>
          )}
          
          <div className="mt-1">
            <h3 className="font-bold text-slate-900 text-lg leading-tight line-clamp-1" title={name}>{name}</h3>
            <div className="mt-1">
               <StarRating rating={rating} readOnly size="sm" />
            </div>
          </div>
        </div>

        {/* Source Badge */}
        <span className={`text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wide border whitespace-nowrap ${
            review.source === 'linkedin' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
            review.source === 'whatsapp' ? 'bg-green-50 text-green-700 border-green-100' :
            review.source === 'twitter' ? 'bg-slate-900 text-white border-slate-900' :
            review.source === 'email' ? 'bg-amber-50 text-amber-700 border-amber-100' :
            'bg-gray-100 text-gray-600 border-gray-200'
        }`}>
            {review.source}
        </span>
      </div>

      {/* Content */}
      <div className="relative flex-grow">
        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-4">
          "{content}"
        </p>
      </div>

      {/* Footer Date */}
      <p className="text-xs text-slate-400 font-medium pt-4 border-t border-slate-50 mt-auto">
          Added on {review.created_at ? new Date(review.created_at).toLocaleDateString() : "Recently"}
      </p>

      {/* ACTION BUTTONS */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors bg-white/80 backdrop-blur-sm border border-slate-100 shadow-sm" 
          title="Edit"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
        </button>
        
        <button 
          onClick={() => setIsDeleteModalOpen(true)}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors bg-white/80 backdrop-blur-sm border border-slate-100 shadow-sm"
          title="Delete"
        >
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>

    {/* EDIT MODAL */}
    <AddReviewModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        initialData={review} 
    />

    {/* CUSTOM DELETE MODAL */}
    {isDeleteModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center space-y-4">
          
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-slate-900">Delete Review?</h3>
            <p className="text-sm text-slate-500 mt-1">
              Are you sure you want to remove this review by <strong>{name}</strong>?
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition disabled:opacity-50 flex justify-center items-center"
            >
               {isDeleting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : "Delete"}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}