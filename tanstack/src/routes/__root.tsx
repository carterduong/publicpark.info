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
      <header className="relative z-10 flex w-full justify-center p-6 [body:has([data-carousel])_&]:text-white [body:has([data-carousel])_&]:mix-blend-exclusion">
        <h1 className="t-body-sans">
          <span className="t-body-serif uppercase">Public Park</span> is a studio that takes ideas
          on a walk <button>( ... )</button>
        </h1>
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
