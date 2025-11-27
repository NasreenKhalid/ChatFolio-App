'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // 1. Get data from the form
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 2. Attempt to sign in
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?message=Could not authenticate user')
  }

  // 3. If successful, refresh and go to dashboard
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // 1. Get data
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 2. Create the user
  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return redirect('/login?message=Could not create user')
  }

  // 3. If successful, redirect
  revalidatePath('/', 'layout')
  redirect('/login?message=Check email to continue sign in process')
}