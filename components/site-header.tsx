'use client'

import { useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'

type NavLink = {
  href: string
  label: string
}

type SiteHeaderProps = {
  links: NavLink[]
}

const DEFAULT_PROPS: SiteHeaderProps = {
  links: [],
}

export const SiteHeader = (props: SiteHeaderProps) => {
  const attrs = {
    ...DEFAULT_PROPS,
    ...props,
  }
  const [menu, setMenu] = useState(false)

  return (
    <>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a href="#top" className="flex items-center gap-3 font-mono text-sm font-bold tracking-[0.2em]">
          <img src="/logo.png" alt="Space Mark" className="h-28 w-auto object-contain object-left sm:h-32" />
        </a>
        <div className="hidden items-center gap-8 text-sm text-primary-foreground/75 md:flex">
          {attrs.links.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
          <a href="/admin" className="rounded-full border border-primary-foreground/30 px-4 py-2 text-primary-foreground">
            Admin <ArrowUpRight className="ml-1 inline" size={14} />
          </a>
        </div>
        <button className="md:hidden" onClick={() => setMenu(!menu)} aria-label="Abrir menú">
          {menu ? <X /> : <Menu />}
        </button>
      </nav>
      {menu ? (
        <div className="flex flex-col gap-5 border-y border-primary-foreground/15 px-6 py-5 md:hidden">
          {attrs.links.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
          <a href="/admin">Admin</a>
        </div>
      ) : null}
    </>
  )
}
