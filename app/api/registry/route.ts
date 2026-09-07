import { NextResponse } from 'next/server'
import { fetchCatalog } from '@/lib/catalog'

// The catalog source of truth for Backstage installs: the product's
// Marketplace panel fetches this (its zod schema strips the extra
// score/votes fields). Anon-key read under RLS; no secrets involved.
export async function GET() {
  const catalog = await fetchCatalog()
  return NextResponse.json(
    {
      plugins: catalog.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        version: p.version,
        author: p.author,
        group: p.group,
        repoUrl: p.repo_url,
        ...(p.icon_url ? { iconUrl: p.icon_url } : {}),
        ...(p.screenshots ? { screenshots: p.screenshots } : {}),
        score: p.score,
        votes: p.votes
      }))
    },
    {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' }
    }
  )
}
