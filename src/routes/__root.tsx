import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

import '../styles.css'

const siteName = 'Lebanon Trails — Discover, plan & share hikes in Lebanon'
const siteDescription =
  'Trail reviews like TripAdvisor, progress tracking like Strava — built only for hiking in Lebanon. Find trails from the Qadisha Valley to the Chouf Cedars, check live conditions, and earn badges.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: siteName },
      { name: 'description', content: siteDescription },
      { property: 'og:title', content: siteName },
      { property: 'og:description', content: siteDescription },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'theme-color', content: '#1d3328' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..800;1,9..144,400..700&family=Schibsted+Grotesk:wght@400;500;600;700&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <Scripts />
      </body>
    </html>
  )
}
