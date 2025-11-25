import Link from 'next/link'
import { signup } from './actions'

export default async function SignupPage(props: {
  searchParams: Promise<{ message: string }>
}) {
  const searchParams = await props.searchParams

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT SIDE: Form */}
      <div className="flex flex-col justify-center items-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-blue-600 font-bold text-2xl tracking-tight">
            TrustWall.
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h1>
          <p className="text-gray-500 mb-8">Start collecting and displaying reviews today.</p>

          <form className="space-y-4">
             <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="business_name">Business Name</label>
              <input 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50 focus:bg-white" 
                id="business_name" name="business_name" type="text" placeholder="e.g. Acme Design Studio" required 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="email">Email</label>
              <input 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50 focus:bg-white" 
                id="email" name="email" type="email" placeholder="name@company.com" required 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="password">Password</label>
              <input 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50 focus:bg-white" 
                id="password" name="password" type="password" placeholder="Create a password" required 
              />
            </div>

            <button formAction={signup} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-sm shadow-blue-200 mt-2">
              Get Started for Free
            </button>

            {searchParams?.message && (
              <div className="p-3 bg-blue-50 text-blue-600 text-sm rounded-lg text-center font-medium border border-blue-100">
                {searchParams.message}
              </div>
            )}
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Visual/Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-blue-600 text-white p-16 relative overflow-hidden">
        {/* Geometric Background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-400 rounded-full blur-xl opacity-50"></div>
        
        <div className="relative z-10 max-w-lg">
            <h2 className="text-5xl font-extrabold mb-6 tracking-tight">Turn client feedback into <span className="text-blue-200">growth.</span></h2>
            <ul className="space-y-4 text-blue-100 text-lg">
                <li className="flex items-center gap-3">
                    <span className="bg-white/20 p-1 rounded-full text-sm">✓</span> 
                    Collect reviews manually
                </li>
                <li className="flex items-center gap-3">
                    <span className="bg-white/20 p-1 rounded-full text-sm">✓</span> 
                    Embed Wall of Love widget
                </li>
                <li className="flex items-center gap-3">
                    <span className="bg-white/20 p-1 rounded-full text-sm">✓</span> 
                    Build trust instantly
                </li>
            </ul>
        </div>
      </div>
    </div>
  )
}