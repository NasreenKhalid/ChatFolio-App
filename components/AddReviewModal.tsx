"use client";

import { createClient } from "../utils/supabase/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StarRating from "./StarRating";

interface ReviewData {
  id?: number;
  reviewer_name: string;
  review_text: string;
  star_rating: number;
  source: string;
  image_url?: string | null;
}

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ReviewData | null;
  userId?: string;
  onReviewAdded?: () => void;
  isLimitReached?: boolean;
}

const STANDARD_SOURCES = ["linkedin", "whatsapp", "twitter", "email"];

export default function AddReviewModal({ 
  isOpen, 
  onClose, 
  initialData, 
  userId 
}: AddReviewModalProps) {
  const supabase = createClient();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    rating: 5,
    source: "linkedin", // This tracks the Dropdown value
  });

  // Separate state for the custom text input
  const [customSourceText, setCustomSourceText] = useState("");

  // Load initial data if editing
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Check if the saved source is one of our standard presets
        const isStandard = STANDARD_SOURCES.includes(initialData.source);

        setFormData({
          name: initialData.reviewer_name,
          content: initialData.review_text,
          rating: initialData.star_rating,
          // If standard, select it. If custom, select 'other'.
          source: isStandard ? initialData.source : "other",
        });
        
        // If it was custom, fill the text box
        setCustomSourceText(isStandard ? "" : initialData.source);
      } else {
        // Reset defaults for new review
        setFormData({ name: "", content: "", rating: 5, source: "linkedin" });
        setCustomSourceText("");
      }
      setImageFile(null); // Always reset file input
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id || userId;
      
      if (!currentUserId) throw new Error("Not authenticated");

      let imageUrl = initialData?.image_url || null;

      // 1. Upload Image logic
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${currentUserId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('review-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase
          .storage
          .from('review-images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrlData.publicUrl;
      }

      // 2. Determine final Source string
      // If dropdown is 'other', use the text input. Otherwise use dropdown value.
      const finalSource = formData.source === "other" ? customSourceText : formData.source;

      // 3. Insert OR Update
      const payload = {
        user_id: currentUserId,
        reviewer_name: formData.name,
        review_text: formData.content,
        star_rating: formData.rating,
        source: finalSource, // <--- Using the calculated source
        image_url: imageUrl,
      };

      let error;

      if (initialData?.id) {
        const { error: updateError } = await supabase
          .from("reviews")
          .update(payload)
          .eq("id", initialData.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("reviews")
          .insert(payload);
        error = insertError;
      }

      if (error) throw error;

      router.refresh();
      onClose();

    } catch (error) {
      console.error("Error saving review:", error);
      alert("Error saving review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 text-lg">
            {initialData ? "Edit Review" : "Add Manual Review"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Client Name</label>
            <input
              required
              type="text"
              placeholder="e.g. Alice Johnson"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Review Content</label>
            <textarea
              required
              rows={4}
              placeholder="What did they say?"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          {/* Rating & Source Row */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Rating</label>
              <div className="pt-2">
                 {/* Ensure StarRating handles onClick correctly */}
                 <StarRating rating={formData.rating} onRatingChange={(r) => setFormData({...formData, rating: r})} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Source</label>
              <select
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              >
                <option value="linkedin">LinkedIn</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="twitter">Twitter / X</option>
                <option value="email">Email</option>
                <option value="other">Other / Custom</option>
              </select>
            </div>
          </div>

          {/* Custom Source Input (Conditionally Rendered) */}
          {formData.source === "other" && (
            <div className="animate-in slide-in-from-top-2 fade-in duration-200">
               <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Specify Source</label>
               <input
                required
                type="text"
                placeholder="e.g. Google Reviews, Upwork..."
                className="w-full px-3 py-2.5 bg-indigo-50/50 border border-indigo-200 text-indigo-900 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-indigo-300"
                value={customSourceText}
                onChange={(e) => setCustomSourceText(e.target.value)}
               />
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
               Attachment {initialData?.image_url && <span className="text-green-600 normal-case ml-1">(Current image saved)</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-xs file:font-bold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100 transition cursor-pointer
              "
              onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition disabled:opacity-50 shadow-lg shadow-indigo-200"
            >
              {loading ? "Saving..." : initialData ? "Update Review" : "Add Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}