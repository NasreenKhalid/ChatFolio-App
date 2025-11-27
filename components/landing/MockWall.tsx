export default function MockWall() {
  const reviews = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Founder, TechStart",
      text: "TrustWall changed how we handle testimonials. We used to copy-paste screenshots, now it's all automated. Highly recommended!",
      stars: 5,
      source: "linkedin",
    },
    {
      id: 2,
      name: "Mark Davis",
      role: "Freelance Designer",
      text: "Simple, clean, and effective. The embed feature works perfectly on my Framer site.",
      stars: 5,
      source: "whatsapp",
    },
    {
      id: 3,
      name: "Emma Wilson",
      role: "Marketing Director",
      text: "Finally, a tool that makes social proof look good without a headache.",
      stars: 4,
      source: "linkedin",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
        </div>
        <div className="text-xs text-slate-400 font-mono ml-2">trustwall.io/embed/demo</div>
      </div>
      
      <div className="p-6 bg-slate-50/50">
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="break-inside-avoid bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    {review.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{review.name}</h4>
                    <p className="text-xs text-slate-500">{review.role}</p>
                  </div>
                </div>
                {/* Badge */}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    review.source === 'linkedin' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                }`}>
                    {review.source}
                </span>
              </div>
              
              <div className="flex text-amber-400 text-xs mb-2">
                {"★".repeat(review.stars)}
              </div>
              
              <p className="text-sm text-slate-600 leading-relaxed">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}