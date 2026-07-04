import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { fetchCatalog } from '@/lib/catalog'
import { VoteButtons } from '@/components/VoteButtons'

export const revalidate = 60

export default async function PluginPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const catalog = await fetchCatalog()
  const plugin = catalog.find((p) => p.id === id)
  if (!plugin) notFound()

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft className="size-3.5" /> All plugins
      </Link>
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">{plugin.name}</h1>
            <p className="mt-1 text-sm text-zinc-600">{plugin.description}</p>
          </div>
          <VoteButtons pluginId={plugin.id} initialScore={plugin.score} />
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-zinc-500">Version</dt>
            <dd className="font-medium">{plugin.version}</dd>
          </div>
          <div>
            <dt className="text-xs text-zinc-500">Author</dt>
            <dd className="font-medium">{plugin.author}</dd>
          </div>
          <div>
            <dt className="text-xs text-zinc-500">Votes</dt>
            <dd className="font-medium">{plugin.votes}</dd>
          </div>
        </dl>
        {plugin.screenshots && plugin.screenshots.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {plugin.screenshots.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                className="rounded-lg border border-zinc-200"
              />
            ))}
          </div>
        )}
        <div className="mt-6 flex items-center gap-3">
          <a
            href={plugin.repo_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            Source & install <ExternalLink className="size-3.5" />
          </a>
          <span className="text-xs text-zinc-500">
            Install: copy into <code>plugins/</code>, register, redeploy.
          </span>
        </div>
      </div>
    </div>
  )
}
