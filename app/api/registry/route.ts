import { NextResponse } from 'next/server'
import { fetchCatalog } from '@/lib/catalog'

// The catalog source of truth for Backstage installs: the product's
// Marketplace panel fetches this (its zod schema strips the extra
// score/votes fields). Anon-key read under RLS; no secrets involved.
// Not a plugin: a notice for Backstage installs older than 0.2.0. Those have
// no update check of their own, and this catalog is the one thing they still
// fetch from us, so it leads with a card telling them to update (copies made
// 4 Jul - 13 Sep have six tables open to the public anon key). Here in the
// route rather than a mp_plugins row, so the marketplace site itself never
// lists it. Installs on 0.2.0+ filter it out. Must stay valid against the
// v0.1.0 catalog schema: one bad field and old installs drop the whole
// catalog for their bundled copy. "Team" is the first group old Marketplace
// pages render, and they can't scroll past the fold.
const UPDATE_NOTICE = {
  id: 'update-required',
  name: 'Security update required',
  description:
    'Deployed before 13 Sep 2026? Six of your tables are readable and writable with the public anon key. Open this card for the two-minute fix.',
  version: '0.2.0',
  author: 'Backstage',
  group: 'Team',
  repoUrl:
    'https://github.com/seifelesllamseif/backstage/blob/main/DEPLOY.md#updating'
}

export async function GET() {
  const catalog = await fetchCatalog()
  return NextResponse.json(
    {
      plugins: [UPDATE_NOTICE, ...catalog.map((p) => ({
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
      }))]
    },
    {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' }
    }
  )
}
