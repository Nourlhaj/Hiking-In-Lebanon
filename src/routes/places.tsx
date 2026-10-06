import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import TrailCard from '@/components/TrailCard'
import { categoryMeta, trails, type Category } from '@/data/fixtures'
import { img } from '@/lib/img'

export const Route = createFileRoute('/places')({
  head: () => ({ meta: [{ title: 'Hidden places — waterfalls, lakes, ruins & camping | Lebanon Trails' }] }),
  component: Places,
})

function Places() {
  const cats = Object.keys(categoryMeta) as Category[]
  const gems = trails.filter((t) => t.hiddenGem)

  return (
    <div>
      <section className="topo border-b border-cedar/10">
        <div className="mx-auto max-w-7xl px-5 py-14">
          <p className="text-xs font-semibold tracking-[0.25em] text-clay uppercase">Discover hidden places</p>
          <h1 className="font-display mt-3 max-w-3xl text-5xl leading-[1.05] font-semibold text-cedar md:text-6xl">
            Beyond the postcards, <em className="font-normal text-clay">there's more.</em>
          </h1>
          <nav className="mt-8 flex flex-wrap gap-2">
            {cats.map((c) => (
              <a
                key={c}
                href={`#${c}`}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-cedar ring-1 ring-cedar/10 transition hover:bg-cedar hover:text-limestone"
              >
                {categoryMeta[c].label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-7xl px-5">
        <div className="rounded-[2rem] bg-cedar p-8 text-limestone md:p-10">
          <h2 className="font-display text-3xl font-semibold">
            Hidden gems <em className="font-normal text-clay">locals love</em>
          </h2>
          <p className="mt-2 max-w-xl text-limestone/70">Quieter trails flagged by the community — fewer crowds, bigger rewards.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {gems.map((t) => (
              <TrailCard key={t.slug} trail={t} />
            ))}
          </div>
        </div>
      </section>

      {cats.map((c, i) => {
        const meta = categoryMeta[c]
        const list = trails.filter((t) => t.categories.includes(c))
        return (
          <section key={c} id={c} className="mx-auto mt-20 max-w-7xl scroll-mt-24 px-5">
            <div className={`grid items-center gap-8 md:grid-cols-[1fr_1.6fr] ${i % 2 ? 'md:[direction:rtl]' : ''}`}>
              <div className="relative h-64 overflow-hidden rounded-[2rem] md:h-full md:min-h-[320px] [direction:ltr]">
                <img src={img(meta.image, 800)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <h2 className="font-display text-3xl font-semibold">{meta.label}</h2>
                  <p className="text-white/80">{meta.blurb}</p>
                  <Link
                    to="/trails"
                    search={{ category: c }}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white hover:underline"
                  >
                    See on map <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 [direction:ltr]">
                {list.slice(0, 4).map((t) => (
                  <TrailCard key={t.slug} trail={t} compact />
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
