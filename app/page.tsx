import Link from 'next/link'
import { fetchCatalog } from '@/lib/catalog'
import { VoteButtons } from '@/components/VoteButtons'

export const revalidate = 60

export default async function BrowsePage(props: {
  searchParams: Promise<{ q?: string; sort?: string }>
}) {
  const { q = '', sort = 'score' } = await props.searchParams
  let catalog = await fetchCatalog()

  const query = q.trim().toLowerCase()
  if (query) {
    catalog = catalog.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.author.toLowerCase().includes(query)
    )
  }
  catalog.sort((a, b) =>
    sort === 'newest'
      ? b.created_at.localeCompare(a.created_at)
      : b.score - a.score
  )

  const groups = new Map<string, typeof catalog>()
  for (const p of catalog) {
    groups.set(p.group, [...(groups.get(p.group) ?? []), p])
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Plugins for Backstage
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Extend the self-hosted team ops dashboard. Vote for what your team
          relies on.
        </p>
        <form className="mt-4 flex gap-2" action="/">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search plugins…"
            className="h-9 w-full max-w-xs rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-500"
          />
          <select
            name="sort"
            defaultValue={sort}
            className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm"
          >
            <option value="score">Top voted</option>
            <option value="newest">Newest</option>
          </select>
          <button className="h-9 rounded-md bg-zinc-900 px-3 text-sm font-medium text-white">
            Go
          </button>
        </form>
      </div>

      {catalog.length === 0 && (
        <p className="py-16 text-center text-sm text-zinc-500">
          No plugins match.
        </p>
      )}

      {[...groups.entries()].map(([group, plugins]) => (
        <section key={group}>
          <h2 className="mb-3 text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
            {group}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {plugins.map((p) => (
              <div
                key={p.id}
                className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-zinc-300"
              >
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/p/${p.id}`}
                    className="font-medium hover:underline"
                  >
                    {p.name}
                  </Link>
                  <VoteButtons pluginId={p.id} initialScore={p.score} />
                </div>
                <p className="text-sm text-zinc-600">{p.description}</p>
                <p className="text-xs text-zinc-500">
                  v{p.version} · {p.author}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
