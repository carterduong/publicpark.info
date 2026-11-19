import type {ReactNode} from 'react'
import {HeadContent, Link, Outlet, Scripts, createRootRoute} from '@tanstack/react-router'

import {DesignTools} from '../components/dev/DesignTools'
import appCss from '../styles.css?url'

const navItems = [
  {to: '/', label: 'Home'},
  {to: '/projects', label: 'Projects'},
  {to: '/info', label: 'Info'},
  {to: '/blog', label: 'Blog'},
  {to: '/radio', label: 'Radio'},
] as const

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {charSet: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {title: 'Public Park'},
    ],
    links: [{rel: 'stylesheet', href: appCss}],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <header className="flex flex-wrap gap-x-4 gap-y-2 p-6 pb-0">
        <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{exact: item.to === '/'}}
              activeProps={{'aria-current': 'page'}}
              className="underline aria-[current=page]:font-semibold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {/* Studio is a separate app served at /studio, so use a full page load. */}
        <a href="/studio" className="underline">
          Studio
        </a>
      </header>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({children}: Readonly<{children: ReactNode}>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        {import.meta.env.DEV && <DesignTools />}
        <Scripts />
      </body>
    </html>
  )
}
