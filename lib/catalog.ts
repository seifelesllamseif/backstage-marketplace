import { createClient } from '@/lib/supabase/server'

export type PluginRow = {
  id: string
  name: string
  description: string
  version: string
  author: string
  group: string
  repo_url: string
  icon_url: string | null
  screenshots: string[] | null
  created_at: string
}

export type PluginWithScore = PluginRow & { score: number; votes: number }

export async function fetchCatalog(): Promise<PluginWithScore[]> {
  const supabase = await createClient()
  const [{ data: plugins }, { data: votes }] = await Promise.all([
    supabase.from('mp_plugins').select('*').order('created_at'),
    supabase.from('mp_votes').select('plugin_id, value')
  ])
  const score = new Map<string, { score: number; votes: number }>()
  for (const v of votes ?? []) {
    const cur = score.get(v.plugin_id) ?? { score: 0, votes: 0 }
    cur.score += v.value
    cur.votes += 1
    score.set(v.plugin_id, cur)
  }
  return ((plugins as PluginRow[]) ?? []).map((p) => ({
    ...p,
    score: score.get(p.id)?.score ?? 0,
    votes: score.get(p.id)?.votes ?? 0
  }))
}
