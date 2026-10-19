import { ArrowRight, Box, Menu } from 'lucide-react';
import { cn } from 'cn';
import Logo from './Logo';
import { buttonVariants } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NAV, TECHNOLOGIES, contactHref } from '@/data/site';

const DOT: Record<string, string> = { battery: 'var(--p-battery)', pmg: 'var(--p-pmg)', evo: 'var(--p-evo)' };

const linkCls =
  'relative inline-flex items-center rounded-full px-3 py-2 font-display text-[0.93rem] font-semibold tracking-[-0.01em] text-ink-soft no-underline transition-colors hover:bg-ink/[0.055] hover:text-ink hover:no-underline aria-[current=page]:text-cobalt-ink aria-[current=page]:after:absolute aria-[current=page]:after:bottom-0.5 aria-[current=page]:after:left-1/2 aria-[current=page]:after:size-1 aria-[current=page]:after:-translate-x-1/2 aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-current';

export default function SiteHeader({ path }: { path: string }) {
  const current = (href: string) => (href === '/' ? path === '/' : path === href || path.startsWith(href + '/'));
  const techActive = TECHNOLOGIES.some((t) => current(t.href));
  const [before, after] = [NAV.slice(0, 2), NAV.slice(2)];
  const navLink = (item: (typeof NAV)[number]) => (
    <NavigationMenuItem key={item.href}>
      <NavigationMenuLink asChild>
        <a href={item.href} className={linkCls} aria-current={current(item.href) ? 'page' : undefined}>
          {item.label}
        </a>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );

  return (
    <header className="site-header">
      <div className="container--wide flex h-[var(--header-h)] items-center gap-5">
        <a href="/" className="flex-none rounded-xl no-underline">
          <Logo uid="hd" />
          <span className="sr-only">, home</span>
        </a>

        <NavigationMenu viewport={false} className="ml-auto hidden xl:flex" aria-label="Primary">
          <NavigationMenuList className="gap-0.5">
            {before.map(navLink)}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  'h-auto rounded-full bg-transparent px-3 py-2 font-display text-[0.93rem] font-semibold tracking-[-0.01em] text-ink-soft hover:bg-ink/[0.055] hover:text-ink data-open:bg-ink/[0.055]',
                  techActive && 'text-cobalt-ink'
                )}
              >
                Technologies
              </NavigationMenuTrigger>
              <NavigationMenuContent className="w-[760px]! max-w-[calc(100vw-48px)] rounded-[var(--r-l)]! border border-line bg-white p-5! shadow-[var(--sh-3)]! md:w-[760px]!">
                <p className="mb-3.5 font-mono text-[0.7rem] tracking-[0.12em] text-slate uppercase">Three product roles · one connected purpose</p>
                <ul className="grid grid-cols-3 gap-2.5">
                  {TECHNOLOGIES.map((t) => (
                    <li key={t.id}>
                      <NavigationMenuLink asChild>
                        <a
                          href={t.href}
                          aria-current={current(t.href) ? 'page' : undefined}
                          style={{ '--dot': DOT[t.id] } as React.CSSProperties}
                          className="grid h-full content-start gap-1.5 rounded-[var(--r-m)] border border-line p-4 text-ink no-underline transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[var(--dot)] hover:bg-[color-mix(in_srgb,var(--dot)_6%,white)] hover:no-underline"
                        >
                          <span className="size-2.5 rounded-[3px] bg-[var(--dot)]" aria-hidden="true" />
                          <span className="font-display font-bold tracking-[-0.015em]">{t.label}</span>
                          <span className="text-[0.8125rem] leading-snug text-slate">{t.description}</span>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
                <div className="mt-3.5 flex items-center justify-between gap-4">
                  <NavigationMenuLink asChild>
                    <a href="/explore" className="flex flex-1 flex-row items-center gap-3 rounded-[var(--r-m)] bg-ice px-3.5 py-3 text-[0.8125rem] leading-snug text-ink no-underline hover:no-underline">
                      <Box className="size-5.5 text-cobalt" aria-hidden="true" />
                      <span>
                        <strong className="block font-display text-[0.92rem]">Explore the vehicle</strong>
                        Rotate, cut away and inspect where each technology operates.
                      </span>
                      <ArrowRight className="ml-auto size-4 text-cobalt" aria-hidden="true" />
                    </a>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <a href="/platform" className="link-arrow flex-none text-[0.9rem]">
                      How the portfolio connects <ArrowRight className="size-4" aria-hidden="true" />
                    </a>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {after.map(navLink)}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex flex-none items-center gap-2.5 xl:ml-0">
          <a href={contactHref('oem-pilot')} className={cn(buttonVariants({ size: 'sm' }), 'hidden sm:inline-flex')}>
            Discuss a Pilot
          </a>
          <Sheet>
            <SheetTrigger asChild>
              <button type="button" className="grid size-[46px] place-items-center rounded-full border border-line-strong bg-white text-ink xl:hidden" aria-label="Open menu">
                <Menu className="size-5" aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full gap-0 overflow-y-auto bg-pearl p-0 sm:max-w-md">
              <div className="flex h-[var(--header-h)] items-center border-b border-line px-5">
                <Logo uid="dr" />
              </div>
              <SheetTitle className="sr-only">Site menu</SheetTitle>
              <SheetDescription className="sr-only">Navigate Mathsya Connected Services</SheetDescription>
              <nav aria-label="Mobile" className="grid gap-7 px-5 pt-4 pb-10">
                <ul className="m-0 list-none p-0">
                  {before.map((item) => (
                    <MobileLink key={item.href} item={item} active={current(item.href)} />
                  ))}
                  <li className="border-b border-line py-3.5">
                    <span className="font-mono text-[0.72rem] tracking-[0.12em] text-slate uppercase">Technologies</span>
                    <ul className="m-0 list-none p-0">
                      {TECHNOLOGIES.map((t) => (
                        <li key={t.id}>
                          <SheetClose asChild>
                            <a
                              href={t.href}
                              aria-current={current(t.href) ? 'page' : undefined}
                              className="flex min-h-[50px] items-center gap-3 pl-1 font-display text-[1.08rem] font-bold tracking-[-0.02em] text-ink no-underline aria-[current=page]:text-cobalt-ink"
                            >
                              <span className="size-2.5 rounded-[3px]" style={{ background: DOT[t.id] }} aria-hidden="true" />
                              {t.label}
                            </a>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </li>
                  {after.map((item) => (
                    <MobileLink key={item.href} item={item} active={current(item.href)} />
                  ))}
                </ul>
                <SheetClose asChild>
                  <a href={contactHref('oem-pilot')} className={cn(buttonVariants(), 'justify-self-start')}>
                    Discuss a Pilot <ArrowRight aria-hidden="true" />
                  </a>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function MobileLink({ item, active }: { item: (typeof NAV)[number]; active: boolean }) {
  return (
    <li className="border-b border-line">
      <SheetClose asChild>
        <a
          href={item.href}
          aria-current={active ? 'page' : undefined}
          className="flex min-h-14 items-center py-1.5 font-display text-[1.35rem] font-bold tracking-[-0.02em] text-ink no-underline aria-[current=page]:text-cobalt-ink"
        >
          {item.label}
        </a>
      </SheetClose>
    </li>
  );
}
