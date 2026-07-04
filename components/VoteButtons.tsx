'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function VoteButtons({
  pluginId,
  initialScore
}: {
  pluginId: string
  initialScore: number
}) {
  const [score, setScore] = useState(initialScore)
  const [mine, setMine] = useState<1 | -1 | 0>(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null
      setUserId(uid)
      if (!uid) return
      const { data: vote } = await supabase
        .from('mp_votes')
        .select('value')
        .eq('plugin_id', pluginId)
        .eq('user_id', uid)
        .maybeSingle()
      if (vote) setMine(vote.value as 1 | -1)
    })
  }, [pluginId])

  async function cast(value: 1 | -1) {
    const supabase = createClient()
    if (!userId) {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      })
      return
    }
    if (busy) return
    setBusy(true)
    if (mine === value) {
      // toggle off
      await supabase
        .from('mp_votes')
        .delete()
        .eq('plugin_id', pluginId)
        .eq('user_id', userId)
      setScore((s) => s - value)
      setMine(0)
    } else {
      await supabase
        .from('mp_votes')
        .upsert(
          { plugin_id: pluginId, user_id: userId, value },
          { onConflict: 'plugin_id,user_id' }
        )
      setScore((s) => s + value - mine)
      setMine(value)
    }
    setBusy(false)
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => cast(1)}
        disabled={busy}
        aria-label="Upvote"
        className={`rounded p-1 transition ${
          mine === 1
            ? 'bg-teal-100 text-teal-700'
            : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700'
        }`}
      >
        <ChevronUp className="size-4" />
      </button>
      <span className="min-w-6 text-center text-sm font-medium tabular-nums">
        {score}
      </span>
      <button
        onClick={() => cast(-1)}
        disabled={busy}
        aria-label="Downvote"
        className={`rounded p-1 transition ${
          mine === -1
            ? 'bg-red-100 text-red-700'
            : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700'
        }`}
      >
        <ChevronDown className="size-4" />
      </button>
    </div>
  )
}
