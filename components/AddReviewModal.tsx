"use client";

import { createClient } from "../utils/supabase/client";
import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import StarRating from "./StarRating";

interface ReviewData {
  id?: number;
  reviewer_name: string;
  review_text: string;
  star_rating: number; // Matches DB
  source: string;
  image_url?: string | null;
}

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ReviewData | null;
  userId?: string;
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
  const [isPending, startTransition] = useTransition(); 
  
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    rating: 5,
    source: "linkedin",
  });

  const [customSourceText, setCustomSourceText] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const isStandard = STANDARD_SOURCES.includes(initialData.source.toLowerCase());
        setFormData({
          name: initialData.reviewer_name,
          content: initialData.review_text,
          rating: initialData.star_rating || 5, // Handle DB mapping
          source: isStandard ? initialData.source.toLowerCase() : "other",
        });
        setCustomSourceText(isStandard ? "" : initialData.source);
      } else {
        setFormData({ name: "", content: "", rating: 5, source: "linkedin" });
        setCustomSourceText("");
      }
      setImageFile(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const currentUserId = user?.id || userId;
            
            if (!currentUserId) throw new Error("Not authenticated");
      
            let imageUrl = initialData?.image_url || null;
      
            // 1. Upload Image
            if (imageFile) {
              const fileExt = imageFile.name.split('.').pop();
              const fileName = `${currentUserId}/${Date.now()}.${fileExt}`;
              const { error: uploadError } = await supabase.storage.from('review-images').upload(fileName, imageFile);
              if (uploadError) throw uploadError;
              
              const { data: publicUrlData } = supabase.storage.from('review-images').getPublicUrl(fileName);
              imageUrl = publicUrlData.publicUrl;
            }
      
            // 2. Prepare Payload (CRITICAL FIX HERE)
            const finalSource = formData.source === "other" ? customSourceText : formData.source;
            
            const payload = {
              user_id: currentUserId,
              reviewer_name: formData.name,   // Map name -> reviewer_name
              review_text: formData.content, // Map content -> review_text
              star_rating: formData.rating,   // 🟢 FIX: Map rating -> star_rating
              source: finalSource,
              image_url: imageUrl,
            };
      
            console.log("Sending Payload:", payload); // Debugging

            // 3. Database Operation
            let error;
            if (initialData?.id) {
              const res = await supabase.from("reviews").update(payload).eq("id", initialData.id);
              error = res.error;
            } else {
              const res = await supabase.from("reviews").insert(payload);
              error = res.error;
            }
      
            if (error) throw error;
      
            setLoading(false);
            onClose();
            router.refresh(); 
            
          } catch (error: any) {
            console.error("Save Error:", error);
            alert(`Error saving: ${error.message || "Unknown error"}`);
            setLoading(false);
          }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 text-lg">
            {initialData ? "Edit Review" : "Add Manual Review"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Inputs */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Client Name</label>
            <input
              required
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Review Content</label>
            <textarea
              required
              rows={4}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Rating</label>
              <div className="pt-2">
                 <StarRating 
                    rating={formData.rating} 
                    setRating={(r) => setFormData({...formData, rating: r})}
                    editable={true}
                 />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Source</label>
              <select
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
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

          {formData.source === "other" && (
            <div className="animate-in slide-in-from-top-2 fade-in duration-200">
               <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Specify Source</label>
               <input
                required
                className="w-full px-3 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                value={customSourceText}
                onChange={(e) => setCustomSourceText(e.target.value)}
               />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
               Attachment {initialData?.image_url && <span className="text-green-600 normal-case ml-1">(Saved)</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition"
              onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">Cancel</button>
            <button
              type="submit"
              disabled={loading || isPending}
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading || isPending ? "Saving..." : initialData ? "Update" : "Add Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}