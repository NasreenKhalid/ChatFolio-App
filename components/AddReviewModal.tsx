"use client";
import { useState } from "react";
import { createClient } from "../utils/supabase/client";

// Add isLimitReached to props
export default function AddReviewModal({ 
  userId, 
  onReviewAdded,
  isLimitReached
}: { 
  userId: string; 
  onReviewAdded: () => void;
  isLimitReached: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    reviewer_name: "",
    review_text: "",
    star_rating: 5,
    source: "whatsapp",
  });

  // Handle the button click
  const handleOpen = () => {
    if (isLimitReached) {
      alert("You have reached the limit of 10 reviews on the Free plan.\n\n(This is where we will trigger the Paddle Payment Overlay later!)");
      return; 
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const supabase = createClient();
    const { error } = await supabase
      .from("reviews")
      .insert({ user_id: userId, ...formData });

    setIsLoading(false);

    if (error) {
      alert("Error: " + error.message);
    } else {
      setIsOpen(false);
      setFormData({ reviewer_name: "", review_text: "", star_rating: 5, source: "whatsapp" });
      onReviewAdded();
    }
  };

  return (
    <>
      <button 
        onClick={handleOpen}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isLimitReached 
            ? "bg-gray-100 text-gray-400 cursor-not-allowed" // Disabled style
            : "bg-black text-white hover:bg-gray-800"        // Active style
        }`}
      >
        {isLimitReached ? "Limit Reached" : "+ Add Review"}
      </button>

      {/* Only show modal if Open AND not limited (double safety) */}
      {isOpen && !isLimitReached && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl">
            {/* ... (Rest of the form code remains exactly the same as before) ... */}
             <h2 className="text-lg font-bold mb-4">Add New Review</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Reviewer Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                  value={formData.reviewer_name}
                  onChange={(e) => setFormData({...formData, reviewer_name: e.target.value})}
                />
              </div>

              {/* Source */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Source</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="email">Email</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({...formData, star_rating: star})}
                      className={`text-2xl ${star <= formData.star_rating ? "text-yellow-400" : "text-gray-200"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Text */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Review Text</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                  value={formData.review_text}
                  onChange={(e) => setFormData({...formData, review_text: e.target.value})}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 text-sm font-medium bg-black text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}