import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Camera, MapPin, Star, ThumbsUp } from 'lucide-react'
import { conditionMeta, conditionReports, getTrail, reviews, trails, type ConditionReport, type Review } from '@/data/fixtures'
import { img } from '@/lib/img'

export const Route = createFileRoute('/community')({
  head: () => ({ meta: [{ title: 'Community — trail reports, reviews & photos | Lebanon Trails' }] }),
  component: CommunityPage,
})

type Tab = 'all' | 'reports' | 'reviews' | 'photos'

type FeedItem =
  | { type: 'report'; id: string; r: ConditionReport }
  | { type: 'review'; id: string; r: Review }

function CommunityPage() {
  const [tab, setTab] = useState<Tab>('all')
  const [kind, setKind] = useState<ConditionReport['kind'] | null>(null)

  const reportItems: FeedItem[] = conditionReports
    .filter((r) => !kind || r.kind === kind)
    .map((r) => ({ type: 'report' as const, id: r.id, r }))
  const reviewItems: FeedItem[] = reviews.map((r) => ({ type: 'review' as const, id: r.id, r }))
  const feed: FeedItem[] =
    tab === 'reports'
      ? reportItems
      : tab === 'reviews'
        ? reviewItems
        : tab === 'photos'
          ? reviewItems.filter((i) => i.type === 'review' && i.r.photo)
          : interleave(reportItems, reviewItems)

  return (
    <div className="mx-auto max-w-7xl px-5 pt-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-clay uppercase">Hiking community</p>
          <h1 className="font-display mt-2 text-5xl font-semibold text-cedar">On the trail this week</h1>

          <div className="mt-6 flex flex-wrap gap-2">
            {(['all', 'reports', 'reviews', 'photos'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                  tab === t ? 'bg-cedar text-limestone' : 'bg-white text-cedar ring-1 ring-cedar/10 hover:ring-cedar/30'
                }`}
              >
                {t === 'reports' ? 'Conditions' : t}
              </button>
            ))}
          </div>

          {tab === 'reports' && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(Object.keys(conditionMeta) as ConditionReport['kind'][]).map((k) => (
                <button
                  key={k}
                  onClick={() => setKind(kind === k ? null : k)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${kind === k ? 'text-white' : 'text-ink/60 hover:text-ink'}`}
                  style={kind === k ? { background: conditionMeta[k].color } : { background: `${conditionMeta[k].color}14` }}
                >
                  {conditionMeta[k].label}
                </button>
              ))}
            </div>
          )}

          <div className={`mt-8 ${tab === 'photos' ? 'grid gap-4 sm:grid-cols-2' : 'space-y-4'}`}>
            {feed.map((item) => {
              const t = getTrail(item.r.trailSlug)!
              if (item.type === 'report') {
                const meta = conditionMeta[item.r.kind]
                return (
                  <article key={item.id} className="flex gap-4 rounded-3xl bg-white p-5 ring-1 ring-cedar/10">
                    <span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ background: meta.color }} />
                    <div className="flex-1">
                      <p className="text-xs font-bold tracking-wider uppercase" style={{ color: meta.color }}>
                        {meta.label}
                      </p>
                      <p className="mt-1 text-[17px] text-ink/85">“{item.r.text}”</p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/50">
                        <span>{item.r.author}</span>
                        <Link to="/trails/$slug" params={{ slug: t.slug }} className="inline-flex items-center gap-1 font-semibold text-clay hover:underline">
                          <MapPin size={12} /> {t.name}
                        </Link>
                        <span>{item.r.postedAgo}</span>
                        <span className="ml-auto inline-flex items-center gap-1"><ThumbsUp size={12} /> {item.r.helpful} found helpful</span>
                      </div>
                    </div>
                  </article>
                )
              }
              return (
                <article key={item.id} className="overflow-hidden rounded-3xl bg-white ring-1 ring-cedar/10">
                  {item.r.photo && <img src={img(item.r.photo, 800)} alt="" loading="lazy" className={`w-full object-cover ${tab === 'photos' ? 'h-56' : 'h-64'}`} />}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} className={i < item.r.rating ? 'fill-moderate text-moderate' : 'text-stone'} />
                        ))}
                      </div>
                      <span className="text-xs text-ink/45">{item.r.date}</span>
                    </div>
                    <h2 className="font-display mt-2 text-xl font-semibold text-cedar">{item.r.title}</h2>
                    {tab !== 'photos' && <p className="mt-1 text-ink/75">{item.r.text}</p>}
                    <p className="mt-3 text-xs text-ink/50">
                      {item.r.author}, {item.r.hometown} ·{' '}
                      <Link to="/trails/$slug" params={{ slug: t.slug }} className="font-semibold text-clay hover:underline">
                        {t.name}
                      </Link>
                    </p>
                  </div>
                </article>
              )
            })}
            {!feed.length && (
              <p className="rounded-3xl bg-white p-10 text-center text-ink/55 ring-1 ring-cedar/10">
                No reports of that kind right now — good news for hikers.
              </p>
            )}
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-cedar p-6 text-limestone">
            <Camera size={22} className="text-clay" />
            <h2 className="font-display mt-3 text-2xl font-semibold">Share your hike</h2>
            <p className="mt-2 text-sm text-limestone/70">
              Post photos, rate the trail and tell the next hiker what to expect. Open any trail page to report
              conditions.
            </p>
            <label className="mt-5 block text-xs font-semibold tracking-wider text-limestone/50 uppercase">Which trail?</label>
            <TrailPicker />
          </div>
          <div className="rounded-3xl bg-white p-6 ring-1 ring-cedar/10">
            <h2 className="font-display text-xl font-semibold text-cedar">Most reported this week</h2>
            <ol className="mt-4 space-y-3">
              {topReported().map(({ trail, count }, i) => (
                <li key={trail.slug} className="flex items-center gap-3">
                  <span className="font-display w-5 text-lg text-clay">{i + 1}</span>
                  <Link to="/trails/$slug" params={{ slug: trail.slug }} className="flex-1 text-sm font-semibold text-cedar hover:underline">
                    {trail.name}
                  </Link>
                  <span className="text-xs text-ink/50">{count} reports</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  )
}

function TrailPicker() {
  const [slug, setSlug] = useState(trails[0].slug)
  return (
    <div className="mt-2 flex gap-2">
      <select
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="min-w-0 flex-1 rounded-full bg-white/10 px-4 py-2.5 text-sm text-limestone outline-none"
      >
        {trails.map((t) => (
          <option key={t.slug} value={t.slug} className="text-ink">
            {t.name}
          </option>
        ))}
      </select>
      <Link
        to="/trails/$slug"
        params={{ slug }}
        hash="conditions"
        className="rounded-full bg-clay px-4 py-2.5 text-sm font-semibold text-white hover:bg-clay-600"
      >
        Go
      </Link>
    </div>
  )
}

function topReported() {
  const counts = new Map<string, number>()
  for (const r of conditionReports) counts.set(r.trailSlug, (counts.get(r.trailSlug) ?? 0) + 1)
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([slug, count]) => ({ trail: getTrail(slug)!, count }))
}

function interleave<T>(a: T[], b: T[]): T[] {
  const out: T[] = []
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i]) out.push(a[i])
    if (b[i]) out.push(b[i])
  }
  return out
}
