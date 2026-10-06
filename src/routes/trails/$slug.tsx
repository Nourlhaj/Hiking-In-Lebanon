import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Bookmark,
  Check,
  CheckCircle2,
  Coffee,
  Download,
  Flag,
  Home,
  MapPin,
  Navigation,
  Star,
  ThumbsUp,
  Utensils,
  Croissant,
} from 'lucide-react'
import TrailMap from '@/components/TrailMap'
import TrailCard, { DifficultyPill } from '@/components/TrailCard'
import {
  MONTHS,
  categoryMeta,
  conditionMeta,
  conditionReports,
  difficultyMeta,
  getChecklist,
  getTrail,
  reviews,
  trails,
  type ConditionReport,
  type NearbySpot,
  type Trail,
} from '@/data/fixtures'
import { formatDuration, img } from '@/lib/img'

export const Route = createFileRoute('/trails/$slug')({
  loader: ({ params }) => {
    const trail = getTrail(params.slug)
    if (!trail) throw notFound()
    return trail
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — ${loaderData.distanceKm} km ${difficultyMeta[loaderData.difficulty].label} hike | Lebanon Trails` },
          { name: 'description', content: loaderData.summary },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-5 py-32 text-center">
      <h1 className="font-display text-4xl text-cedar">Trail not found</h1>
      <p className="mt-3 text-ink/60">This path may have been renamed or merged with another route.</p>
      <Link to="/trails" className="mt-8 inline-block rounded-full bg-cedar px-5 py-3 font-semibold text-limestone">
        Browse all trails
      </Link>
    </div>
  ),
  component: TrailPage,
})

function TrailPage() {
  const trail = Route.useLoaderData()
  const [completed, setCompleted] = useState(false)
  const [saved, setSaved] = useState(false)
  const d = difficultyMeta[trail.difficulty]
  const similar = trails
    .filter((t) => t.slug !== trail.slug && t.categories.some((c) => trail.categories.includes(c)))
    .slice(0, 3)

  return (
    <article key={trail.slug}>
      {/* Gallery */}
      <div className="mx-auto max-w-7xl px-5 pt-6">
        <Link to="/trails" className="inline-flex items-center gap-1.5 text-sm font-medium text-cedar/70 hover:text-cedar">
          <ArrowLeft size={16} /> All trails
        </Link>
        <div className="mt-4 grid h-[340px] gap-3 overflow-hidden rounded-[2rem] md:h-[460px] md:grid-cols-[2fr_1fr]">
          <div className="relative overflow-hidden">
            <img src={img(trail.photos[0], 1200)} alt={trail.name} className="h-full w-full object-cover" fetchPriority="high" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white md:p-8">
              <DifficultyPill difficulty={trail.difficulty} />
              <h1 className="font-display mt-3 text-4xl leading-tight font-semibold md:text-5xl">{trail.name}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-white/85">
                <MapPin size={15} /> {trail.location}
              </p>
            </div>
          </div>
          <div className="hidden grid-rows-2 gap-3 md:grid">
            {trail.photos.slice(1, 3).map((p) => (
              <img key={p} src={img(p, 600)} alt="" loading="lazy" className="h-full w-full object-cover" />
            ))}
            {trail.photos.length < 3 && (
              <div className="topo flex items-center justify-center bg-sand text-center text-sm text-cedar/60">
                Hikers' photos coming soon
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-7xl gap-10 px-5 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Star size={18} className="fill-moderate text-moderate" />
              <span className="font-semibold text-cedar">{trail.rating}</span>
              <span className="text-sm text-ink/55">· {trail.reviewCount} reviews · {trail.completedCount.toLocaleString()} hikers completed</span>
            </div>
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setSaved((s) => !s)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
                  saved ? 'bg-cedar/5 text-cedar ring-cedar/30' : 'text-cedar ring-cedar/15 hover:ring-cedar/30'
                }`}
              >
                <Bookmark size={15} className={saved ? 'fill-cedar' : ''} /> {saved ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={() => setCompleted((c) => !c)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  completed ? 'bg-easy text-white' : 'bg-clay text-white hover:bg-clay-600'
                }`}
              >
                <CheckCircle2 size={15} /> {completed ? 'Logged to passport' : 'I hiked this'}
              </button>
            </div>
          </div>
          {completed && (
            <div className="rise mt-4 flex items-center gap-3 rounded-2xl bg-easy/10 px-4 py-3 text-sm text-cedar">
              <CheckCircle2 size={18} className="text-easy" />
              Nice one! +{trail.distanceKm} km and ↑{trail.elevationGainM} m added to your{' '}
              <Link to="/passport" className="font-semibold underline">passport</Link>.
            </div>
          )}

          {/* Stats */}
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-cedar/10 ring-1 ring-cedar/10 sm:grid-cols-4">
            {[
              ['Distance', `${trail.distanceKm} km`],
              ['Duration', formatDuration(trail.durationHours)],
              ['Elevation gain', `${trail.elevationGainM} m`],
              ['Difficulty', d.label],
              ['Best season', trail.bestSeason],
              ['Route type', trail.routeType],
              ['Highest point', `${trail.maxAltitudeM.toLocaleString()} m`],
              ['Region', trail.region],
            ].map(([k, v]) => (
              <div key={k} className="bg-white p-5">
                <dt className="text-[11px] font-semibold tracking-wider text-ink/45 uppercase">{k}</dt>
                <dd className={`font-display mt-1 text-lg leading-tight font-semibold ${k === 'Difficulty' ? d.textClass : 'text-cedar'}`}>{v}</dd>
              </div>
            ))}
          </dl>

          <SeasonStrip trail={trail} />

          {/* About */}
          <section className="mt-10">
            <h2 className="font-display text-2xl font-semibold text-cedar">About this trail</h2>
            <p className="mt-3 text-[17px] leading-relaxed text-ink/75">{trail.description}</p>
            <p className="mt-4 flex items-start gap-2 text-sm text-ink/60">
              <Navigation size={16} className="mt-0.5 shrink-0 text-clay" />
              <span>
                <strong className="text-cedar">Starting point:</strong> {trail.startPoint}
              </span>
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {trail.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 rounded-xl bg-sand/50 px-4 py-3 text-sm text-cedar">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" /> {h}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {trail.categories.map((c) => (
                <Link
                  key={c}
                  to="/trails"
                  search={{ category: c }}
                  className="rounded-full px-3 py-1 text-xs font-semibold text-cedar ring-1 ring-cedar/15 hover:bg-cedar hover:text-limestone"
                >
                  {categoryMeta[c].label}
                </Link>
              ))}
            </div>
          </section>

          {/* Route */}
          <section className="mt-12">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold text-cedar">GPS route</h2>
              <button
                onClick={() => downloadGpx(trail)}
                className="inline-flex items-center gap-1.5 rounded-full bg-cedar px-4 py-2 text-sm font-semibold text-limestone hover:bg-cedar-800"
              >
                <Download size={15} /> Download GPX
              </button>
            </div>
            <TrailMap trails={[trail]} showRoute className="mt-4 h-[420px] rounded-3xl ring-1 ring-cedar/10" />
            <p className="mt-2 text-xs text-ink/45">
              Route shown is an approximate track. Always carry an offline map and follow local trail markings.
            </p>
          </section>

          <Conditions trail={trail} />
          <Reviews trail={trail} />
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Checklist trail={trail} />
          <Nearby spots={trail.nearby} />
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mx-auto mt-20 max-w-7xl px-5">
          <h2 className="font-display text-3xl font-semibold text-cedar">You might also like</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((t) => (
              <TrailCard key={t.slug} trail={t} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

function SeasonStrip({ trail }: { trail: Trail }) {
  const now = new Date().getMonth() + 1
  return (
    <div className="mt-6">
      <p className="text-[11px] font-semibold tracking-wider text-ink/45 uppercase">When to go</p>
      <div className="mt-2 grid grid-cols-12 gap-1">
        {MONTHS.map((m, i) => {
          const good = trail.bestMonths.includes(i + 1)
          return (
            <div key={m} className="text-center">
              <div
                className={`h-8 rounded-md ${good ? 'bg-moss' : 'bg-sand'} ${i + 1 === now ? 'ring-2 ring-clay ring-offset-2 ring-offset-limestone' : ''}`}
              />
              <span className={`mt-1 block text-[10px] font-medium ${good ? 'text-cedar' : 'text-ink/40'}`}>{m}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Checklist({ trail }: { trail: Trail }) {
  const items = useMemo(() => getChecklist(trail), [trail])
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const done = checked.size
  return (
    <section className="rounded-3xl bg-cedar p-6 text-limestone">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Bring with you</h2>
        <span className="text-sm text-limestone/60">
          {done}/{items.length}
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-clay transition-all duration-500" style={{ width: `${(done / items.length) * 100}%` }} />
      </div>
      <ul className="mt-4 space-y-1">
        {items.map((item, i) => {
          const on = checked.has(i)
          return (
            <li key={item}>
              <button
                onClick={() =>
                  setChecked((s) => {
                    const n = new Set(s)
                    if (on) n.delete(i)
                    else n.add(i)
                    return n
                  })
                }
                className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition hover:bg-white/5"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                    on ? 'border-easy bg-easy' : 'border-white/30'
                  }`}
                >
                  {on && <Check size={13} strokeWidth={3} />}
                </span>
                <span className={on ? 'text-limestone/50 line-through' : ''}>{item}</span>
              </button>
            </li>
          )
        })}
      </ul>
      {done === items.length && <p className="rise mt-4 text-sm font-semibold text-clay">All packed — yalla, enjoy the trail!</p>}
    </section>
  )
}

const spotIcons: Record<NearbySpot['kind'], typeof Coffee> = {
  Café: Coffee,
  Restaurant: Utensils,
  Guesthouse: Home,
  Bakery: Croissant,
}

function Nearby({ spots }: { spots: NearbySpot[] }) {
  return (
    <section className="rounded-3xl bg-white p-6 ring-1 ring-cedar/10">
      <h2 className="font-display text-xl font-semibold text-cedar">Eat & rest nearby</h2>
      <ul className="mt-4 space-y-4">
        {spots.map((s) => {
          const Icon = spotIcons[s.kind]
          return (
            <li key={s.name} className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sand text-clay">
                <Icon size={18} />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-cedar">{s.name}</p>
                <p className="text-sm text-ink/60">{s.note}</p>
                <p className="mt-0.5 text-xs text-ink/45">
                  {s.kind} · {s.distanceKm} km from trailhead
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Conditions({ trail }: { trail: Trail }) {
  const [local, setLocal] = useState<ConditionReport[]>([])
  const [kind, setKind] = useState<ConditionReport['kind']>('clear')
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const list = [...local, ...conditionReports.filter((r) => r.trailSlug === trail.slug)]

  return (
    <section id="conditions" className="mt-14 scroll-mt-24">
      <h2 className="font-display text-2xl font-semibold text-cedar">Trail conditions</h2>
      <p className="mt-1 text-sm text-ink/55">Reported by hikers in the last week</p>

      <form
        className="mt-5 rounded-3xl bg-sand/50 p-5"
        onSubmit={(e) => {
          e.preventDefault()
          if (text.trim().length < 8) return setError('Tell other hikers a little more — at least a few words.')
          setLocal((l) => [
            { id: `local-${Date.now()}`, trailSlug: trail.slug, author: 'You', kind, text: text.trim(), postedAgo: 'just now', helpful: 0 },
            ...l,
          ])
          setText('')
          setError('')
        }}
      >
        <p className="flex items-center gap-2 text-sm font-semibold text-cedar">
          <Flag size={15} /> Report conditions
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(Object.keys(conditionMeta) as ConditionReport['kind'][]).map((k) => (
            <button
              type="button"
              key={k}
              onClick={() => setKind(k)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${kind === k ? 'text-white' : 'bg-white text-ink/70 hover:text-ink'}`}
              style={kind === k ? { background: conditionMeta[k].color } : undefined}
            >
              {conditionMeta[k].label}
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. “Trail is muddy after rain near the spring”"
            className="min-w-0 flex-1 rounded-full bg-white px-4 py-2.5 text-sm ring-1 ring-cedar/10 outline-none focus:ring-cedar/40"
          />
          <button className="rounded-full bg-cedar px-5 text-sm font-semibold text-limestone hover:bg-cedar-800">Post</button>
        </div>
        {error && <p className="mt-2 text-sm text-hard">{error}</p>}
      </form>

      {list.length ? (
        <ul className="mt-4 divide-y divide-cedar/10">
          {list.map((r) => (
            <li key={r.id} className={`flex gap-4 py-4 ${r.id.startsWith('local') ? 'rise' : ''}`}>
              <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full" style={{ background: conditionMeta[r.kind].color }} />
              <div className="flex-1">
                <p className="text-ink/85">{r.text}</p>
                <p className="mt-1 text-xs text-ink/50">
                  <strong style={{ color: conditionMeta[r.kind].color }}>{conditionMeta[r.kind].label}</strong> · {r.author} ·{' '}
                  {r.postedAgo}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 self-start text-xs text-ink/45">
                <ThumbsUp size={12} /> {r.helpful}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-ink/50">No reports this week. Be the first to tell others how it looks.</p>
      )}
    </section>
  )
}

function Reviews({ trail }: { trail: Trail }) {
  const list = reviews.filter((r) => r.trailSlug === trail.slug)
  return (
    <section className="mt-14">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-2xl font-semibold text-cedar">Reviews</h2>
        <span className="flex items-center gap-1 text-sm text-ink/60">
          <Star size={15} className="fill-moderate text-moderate" /> {trail.rating} average · {trail.reviewCount}
        </span>
      </div>
      {list.length ? (
        <div className="mt-5 space-y-5">
          {list.map((r) => (
            <article key={r.id} className="rounded-3xl bg-white p-6 ring-1 ring-cedar/10">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cedar font-display font-semibold text-limestone">
                  {r.author.split(' ').map((p) => p[0]).join('')}
                </span>
                <div>
                  <p className="font-semibold text-cedar">{r.author}</p>
                  <p className="text-xs text-ink/50">
                    {r.hometown} · {r.date}
                  </p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < r.rating ? 'fill-moderate text-moderate' : 'text-stone'} />
                  ))}
                </div>
              </div>
              <h3 className="font-display mt-4 text-lg font-semibold text-cedar">{r.title}</h3>
              <p className="mt-1 leading-relaxed text-ink/75">{r.text}</p>
              {r.photo && <img src={img(r.photo, 500)} alt="" loading="lazy" className="mt-4 h-40 w-64 rounded-2xl object-cover" />}
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-3xl bg-white p-6 text-sm text-ink/55 ring-1 ring-cedar/10">
          Detailed reviews for this trail are on their way — hiked it recently? Share how it went.
        </p>
      )}
    </section>
  )
}

function downloadGpx(trail: Trail) {
  const pts = trail.route.map(([lat, lon]) => `      <trkpt lat="${lat}" lon="${lon}"></trkpt>`).join('\n')
  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Lebanon Trails" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><name>${trail.name}</name></metadata>
  <trk>
    <name>${trail.name}</name>
    <trkseg>
${pts}
    </trkseg>
  </trk>
</gpx>`
  const url = URL.createObjectURL(new Blob([gpx], { type: 'application/gpx+xml' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `${trail.slug}.gpx`
  a.click()
  URL.revokeObjectURL(url)
}
