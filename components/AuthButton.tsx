'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function AuthButton() {
  const [email, setEmail] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.user_metadata?.user_name ?? data.user?.email ?? null)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(
        session?.user?.user_metadata?.user_name ?? session?.user?.email ?? null
      )
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  async function signIn() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (!ready) return <span className="w-20" />
  return email ? (
    <button
      onClick={signOut}
      className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs transition hover:bg-zinc-100"
      title={`Signed in as ${email}`}
    >
      Sign out
    </button>
  ) : (
    <button
      onClick={signIn}
      className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-700"
    >
      Sign in with GitHub
    </button>
  )
}
