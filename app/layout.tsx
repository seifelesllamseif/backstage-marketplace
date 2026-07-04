import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { AuthButton } from '@/components/AuthButton'

export const metadata: Metadata = {
  title: 'Backstage Marketplace',
  description:
    'Browse and vote on plugins for Backstage, the self-hosted team ops dashboard.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 font-sans text-zinc-900 antialiased">
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded bg-zinc-900 text-[11px] font-bold text-white">
                B
              </span>
              <span className="text-sm font-semibold tracking-tight">
                Backstage Marketplace
              </span>
            </Link>
            <nav className="flex items-center gap-3 text-sm">
              <a
                href="https://github.com/SEIFSEIF4/backstage/blob/main/PLUGINS.md"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-600 transition hover:text-zinc-900"
              >
                Build a plugin
              </a>
              <AuthButton />
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto w-full max-w-5xl px-4 pb-10 text-xs text-zinc-500">
          Plugins are community-submitted.{' '}
          <a
            href="https://github.com/SEIFSEIF4/backstage/issues/new?title=Marketplace%20submission:%20"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            Submit yours
          </a>{' '}
          via a registry PR.
        </footer>
      </body>
    </html>
  )
}
