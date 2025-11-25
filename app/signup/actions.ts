'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const businessName = formData.get('business_name') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // We pass the business name as metadata so Supabase can access it
      data: {
        business_name: businessName,
      },
    },
  })

  if (error) {
    return redirect('/signup?message=Could not create user: ' + error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=Account created! Please check your email to confirm.')
}