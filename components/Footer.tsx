import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold text-indigo-600 tracking-tight">
              TrustWall.
            </Link>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed">
              Collect reviews from WhatsApp & LinkedIn and showcase them on your website in seconds.
            </p>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/#features" className="hover:text-indigo-600 transition">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-indigo-600 transition">Pricing</Link></li>
              <li><Link href="/login" className="hover:text-indigo-600 transition">Log In</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="#" className="hover:text-indigo-600 transition">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition">Terms of Service</Link></li>
            </ul>
          </div>

           {/* Social / Contact */}
           <div>
            <h4 className="font-bold text-slate-900 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="mailto:support@trustwall.io" className="hover:text-indigo-600 transition">support@trustwall.io</a></li>
              <li className="flex gap-4 mt-4">
                {/* Twitter Icon */}
                <a href="#" className="text-slate-400 hover:text-indigo-500 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} TrustWall. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with ❤️ for Creators</p>
        </div>
      </div>
    </footer>
  );
}