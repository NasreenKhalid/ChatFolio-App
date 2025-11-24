export default function ReviewCard({ review }: { review: any }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          {/* Source Badge */}
          <span className={`px-2 py-1 text-xs font-bold rounded capitalize
            ${review.source === 'whatsapp' ? 'bg-green-100 text-green-700' : 
              review.source === 'linkedin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
            {review.source}
          </span>
          {/* Star Rating */}
          <div className="flex text-yellow-400 text-sm">
            {"★".repeat(review.star_rating)}
            <span className="text-gray-300">{"★".repeat(5 - review.star_rating)}</span>
          </div>
        </div>
        <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
      </div>
      
      <p className="text-gray-800 text-sm mb-4 leading-relaxed">"{review.review_text}"</p>
      
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
          {review.reviewer_name.charAt(0)}
        </div>
        <span className="text-sm font-medium text-gray-900">{review.reviewer_name}</span>
      </div>
    </div>
  );
}