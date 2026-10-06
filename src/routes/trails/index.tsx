import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Map as MapIcon, List, Search, SlidersHorizontal, X } from 'lucide-react'
import TrailMap from '@/components/TrailMap'
import TrailCard from '@/components/TrailCard'
import {
  MONTHS,
  categoryMeta,
  difficultyMeta,
  trails,
  type Category,
  type Difficulty,
} from '@/data/fixtures'

interface ExploreSearch {
  q?: string
  difficulty?: Difficulty
  category?: Category
  month?: number
}

export const Route = createFileRoute('/trails/')({
  validateSearch: (s: Record<string, unknown>): ExploreSearch => ({
    q: typeof s.q === 'string' && s.q ? s.q : undefined,
    difficulty: s.difficulty && s.difficulty in difficultyMeta ? (s.difficulty as Difficulty) : undefined,
    category: s.category && (s.category as string) in categoryMeta ? (s.category as Category) : undefined,
    month: Number(s.month) >= 1 && Number(s.month) <= 12 ? Number(s.month) : undefined,
  }),
  head: () => ({ meta: [{ title: 'Explore trails on the map — Lebanon Trails' }] }),
  component: Explore,
})

type Sort = 'rating' | 'distance' | 'popular'

function Explore() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/trails/' })
  const [active, setActive] = useState<string | null>(null)
  const [sort, setSort] = useState<Sort>('rating')
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list')

  const set = (patch: Partial<ExploreSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })

  const results = useMemo(() => {
    const q = search.q?.toLowerCase().trim()
    const list = trails.filter((t) => {
      if (search.difficulty && t.difficulty !== search.difficulty) return false
      if (search.category && !t.categories.includes(search.category)) return false
      if (search.month && !t.bestMonths.includes(search.month)) return false
      if (q) {
        const hay = [t.name, t.location, t.region, t.summary, ...t.categories].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    return list.sort((a, b) =>
      sort === 'rating' ? b.rating - a.rating : sort === 'distance' ? a.distanceKm - b.distanceKm : b.completedCount - a.completedCount,
    )
  }, [search, sort])

  const hasFilters = !!(search.q || search.difficulty || search.category || search.month)

  return (
    <div className="mx-auto max-w-[1600px] px-5 pt-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold text-cedar">Explore trails</h1>
          <p className="mt-1 text-ink/60">
            {results.length} of {trails.length} trails · tap a pin or a card for details
          </p>
        </div>
        <div className="flex rounded-full bg-white p-1 ring-1 ring-cedar/10 lg:hidden">
          {(['list', 'map'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setMobileView(v)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${
                mobileView === v ? 'bg-cedar text-limestone' : 'text-cedar'
              }`}
            >
              {v === 'list' ? <List size={15} /> : <MapIcon size={15} />} {v}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-40 -mx-5 mt-5 border-y border-cedar/10 bg-limestone/90 px-5 py-3 backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-cedar/10 focus-within:ring-cedar/40 sm:max-w-xs">
            <Search size={16} className="text-ink/40" />
            <input
              value={search.q ?? ''}
              onChange={(e) => set({ q: e.target.value || undefined })}
              placeholder="Search trails, villages…"
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>

          <div className="flex gap-1 rounded-full bg-white p-1 ring-1 ring-cedar/10">
            {(Object.keys(difficultyMeta) as Difficulty[]).map((d) => {
              const on = search.difficulty === d
              return (
                <button
                  key={d}
                  onClick={() => set({ difficulty: on ? undefined : d })}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    on ? 'bg-cedar text-limestone' : 'text-cedar hover:bg-cedar/5'
                  }`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${difficultyMeta[d].bgClass}`} />
                  {difficultyMeta[d].label}
                </button>
              )
            })}
          </div>

          <select
            value={search.category ?? ''}
            onChange={(e) => set({ category: (e.target.value || undefined) as Category | undefined })}
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-cedar ring-1 ring-cedar/10 outline-none"
          >
            <option value="">All places</option>
            {(Object.keys(categoryMeta) as Category[]).map((c) => (
              <option key={c} value={c}>
                {categoryMeta[c].label}
              </option>
            ))}
          </select>

          <select
            value={search.month ?? ''}
            onChange={(e) => set({ month: e.target.value ? Number(e.target.value) : undefined })}
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-cedar ring-1 ring-cedar/10 outline-none"
          >
            <option value="">Any season</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                Good in {m}
              </option>
            ))}
          </select>

          <label className="ml-auto flex items-center gap-2 text-sm text-ink/60">
            <SlidersHorizontal size={15} />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="bg-transparent font-medium text-cedar outline-none"
            >
              <option value="rating">Top rated</option>
              <option value="popular">Most hiked</option>
              <option value="distance">Shortest first</option>
            </select>
          </label>

          {hasFilters && (
            <button
              onClick={() => navigate({ search: {}, replace: true })}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-clay hover:bg-clay/10"
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(380px,1fr)_1.25fr]">
        <div className={`${mobileView === 'map' ? 'hidden' : ''} lg:block`}>
          {results.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {results.map((t) => (
                <TrailCard key={t.slug} trail={t} active={t.slug === active} onHover={setActive} />
              ))}
            </div>
          ) : (
            <div className="topo flex flex-col items-center rounded-3xl bg-white px-6 py-20 text-center ring-1 ring-cedar/10">
              <MapIcon size={36} className="text-cedar/30" />
              <h2 className="font-display mt-4 text-2xl text-cedar">No trails match those filters</h2>
              <p className="mt-2 max-w-xs text-sm text-ink/55">
                Try another season or difficulty — Lebanon has something good to walk every month of the year.
              </p>
              <button
                onClick={() => navigate({ search: {}, replace: true })}
                className="mt-6 rounded-full bg-cedar px-5 py-2.5 text-sm font-semibold text-limestone"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        <div className={`${mobileView === 'list' ? 'hidden' : ''} lg:block`}>
          <div className="sticky top-[8.5rem]">
            <TrailMap
              trails={results}
              activeSlug={active}
              onSelect={setActive}
              showRoute
              className="h-[calc(100vh-10rem)] min-h-[480px] rounded-3xl ring-1 ring-cedar/10"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
