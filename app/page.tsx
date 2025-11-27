import Link from "next/link";
import Footer from "../components/Footer"; // Import the new footer

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* 🟢 NAVBAR */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold text-indigo-600 tracking-tighter group-hover:opacity-80 transition-opacity">TrustWall.</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block">
              Log in
            </Link>
            <Link href="/signup" className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        
        {/* 🟢 HERO SECTION */}
        <section className="pt-24 pb-20 px-6 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              Now available for everyone
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1] animate-in slide-in-from-bottom-8 fade-in duration-700 fill-mode-both delay-100">
              Turn <span className="text-indigo-600">Screenshots</span> into <br className="hidden md:block" />
              Social Proof.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-8 fade-in duration-700 fill-mode-both delay-200">
              Stop sending messy WhatsApp screenshots to clients. Create a beautiful, embeddable "Wall of Love" for your portfolio in less than 2 minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in slide-in-from-bottom-8 fade-in duration-700 fill-mode-both delay-300">
              <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2">
                Create My Wall
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <Link href="#demo" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center">
                See Live Demo
              </Link>
            </div>
          </div>
        </section>

        {/* 🟢 VISUAL DEMO / MOCK PREVIEW */}
        <section id="demo" className="pb-24 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Browser Window Frame */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-1000 delay-300">
              
              {/* Fake Browser Bar */}
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 bg-white border border-slate-200 rounded-md h-8 flex items-center px-3 text-xs text-slate-400 font-mono">
                  your-portfolio.com
                </div>
              </div>

              {/* Fake Website Content */}
              <div className="p-8 md:p-12 bg-white">
                <div className="max-w-3xl mx-auto text-center mb-12">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">My Portfolio</p>
                   <h3 className="text-3xl font-bold text-slate-900 mb-4">What my clients say</h3>
                   <div className="w-16 h-1 bg-indigo-500 mx-auto rounded-full"></div>
                </div>

                {/* THE MOCK WIDGET GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Mock Card 1 */}
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">A</div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Ahmed Al-Sayed</p>
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">LINKEDIN</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">"The best freelancer I have worked with! Delivered the project 2 days early. Highly recommended."</p>
                    <div className="flex text-yellow-400 text-xs mt-3">★★★★★</div>
                  </div>

                  {/* Mock Card 2 */}
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 font-bold">S</div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Sarah Miller</p>
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">WHATSAPP</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">"Absolutely love the new design. TrustWall made it so easy to display these reviews!"</p>
                    <div className="flex text-yellow-400 text-xs mt-3">★★★★★</div>
                  </div>

                  {/* Mock Card 3 */}
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-bold">J</div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">John Doe</p>
                        <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">EMAIL</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">"Professional, fast, and high quality work. Will definitely hire again."</p>
                    <div className="flex text-yellow-400 text-xs mt-3">★★★★★</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 🟢 FEATURES GRID */}
        <section id="features" className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-6">
             <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-slate-900">Why Freelancers Love TrustWall</h2>
               <p className="text-slate-500 mt-2">Everything you need to build trust instantly.</p>
             </div>

             <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                 <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-6">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">Upload Screenshots</h3>
                 <p className="text-slate-600 leading-relaxed">Don't lose your WhatsApp or LinkedIn praise. Upload the screenshot as proof and verify the review.</p>
               </div>

               <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                 <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 mb-6">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">No Coding Required</h3>
                 <p className="text-slate-600 leading-relaxed">Just copy a single line of code and paste it into your WordPress, Framer, or custom website.</p>
               </div>

               <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                 <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-6">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">Source Badges</h3>
                 <p className="text-slate-600 leading-relaxed">Automatically tag reviews with WhatsApp, LinkedIn, or Email badges to increase credibility.</p>
               </div>
             </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}