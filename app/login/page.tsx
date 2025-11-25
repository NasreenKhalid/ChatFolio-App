import Link from 'next/link'
import { login } from './actions'

export default async function LoginPage(props: {
  searchParams: Promise<{ message: string }>
}) {
  const searchParams = await props.searchParams
  
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT SIDE: Form */}
      <div className="flex flex-col justify-center items-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-sm">
          {/* Logo Placeholder */}
          <div className="mb-10 text-blue-600 font-bold text-2xl tracking-tight">
            TrustWall.
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-8">Enter your details to access your dashboard.</p>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="email">Email</label>
              <input 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50 focus:bg-white" 
                id="email" name="email" type="email" placeholder="name@company.com" required 
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-gray-700" htmlFor="password">Password</label>
              </div>
              <input 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50 focus:bg-white" 
                id="password" name="password" type="password" placeholder="••••••••" required 
              />
            </div>

            <button formAction={login} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-sm shadow-blue-200">
              Sign In
            </button>

            {searchParams?.message && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium border border-red-100">
                {searchParams.message}
              </div>
            )}
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Visual/Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gray-900 text-white p-16 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 -ml-20 -mb-20"></div>
        
        <div className="relative z-10 max-w-lg text-center">
          <div className="inline-block p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm border border-white/10">
            <span className="text-3xl">⭐️⭐️⭐️⭐️⭐️</span>
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">"This tool completely changed how we showcase client trust."</h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400"></div>
            <div className="text-left">
              <p className="font-bold text-white">Sarah Jenkins</p>
              <p className="text-gray-400 text-sm">Freelance Designer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}