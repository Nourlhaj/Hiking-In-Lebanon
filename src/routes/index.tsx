import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, ArrowUpRight, MapPin, MessageCircle, Search, Star, ThumbsUp } from 'lucide-react'
import TrailMap from '@/components/TrailMap'
import TrailCard from '@/components/TrailCard'
import BadgeMedal from '@/components/BadgeMedal'
import {
  badges,
  categoryMeta,
  conditionMeta,
  conditionReports,
  getTrail,
  reviews,
  trails,
  type Category,
} from '@/data/fixtures'
import { img } from '@/lib/img'

export const Route = createFileRoute('/')({
  component: Home,
})

const featured = ['qadisha-valley', 'baatara-gorge', 'qornet-es-sawda', 'jannet-chouwen', 'barouk-cedars', 'faqra-ruins']
  .map((s) => getTrail(s)!)
  .filter(Boolean)

function Home() {
  return (
    <>
      <Hero />
      <MapTeaser />
      <FeaturedTrails />
      <HiddenPlaces />
      <Community />
      <Gamification />
      <ClosingCta />
    </>
  )
}

function Hero() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const report = conditionReports[1]

  return (
    <section className="relative overflow-hidden">
      <div className="topo absolute inset-0 opacity-70" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pt-10 pb-16 md:grid-cols-[1.05fr_1fr] md:pt-16 lg:gap-16">
        <div className="flex flex-col justify-center">
          <span className="rise inline-flex w-fit items-center gap-2 rounded-full border border-cedar/15 bg-white/70 px-3 py-1.5 text-xs font-semibold text-cedar">
            <span className="h-1.5 w-1.5 rounded-full bg-clay" />
            TripAdvisor + Strava — only for hiking in Lebanon
          </span>
          <h1
            className="rise font-display mt-6 text-[2.9rem] leading-[1.02] font-semibold tracking-tight text-cedar sm:text-6xl lg:text-7xl"
            style={{ animationDelay: '80ms' }}
          >
            Find your next
            <br />
            trail, from <em className="font-normal text-clay">cedar</em>
            <br />
            to <em className="font-normal text-clay">summit.</em>
          </h1>
          <p className="rise mt-6 max-w-lg text-lg leading-relaxed text-ink/70" style={{ animationDelay: '160ms' }}>
            {trails.length} hand-mapped trails across Lebanon with GPS routes, honest reviews and conditions reported by
            hikers this week. Plan it, walk it, log it — and collect badges as you go.
          </p>

          <form
            className="rise mt-8 flex max-w-lg items-center gap-2 rounded-full bg-white p-1.5 shadow-lg shadow-cedar/10 ring-1 ring-cedar/10"
            style={{ animationDelay: '240ms' }}
            onSubmit={(e) => {
              e.preventDefault()
              navigate({ to: '/trails', search: { q: q || undefined } })
            }}
          >
            <Search size={18} className="ml-3 text-ink/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Try “Qadisha”, “waterfall” or “Chouf”"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] outline-none placeholder:text-ink/40"
            />
            <button className="rounded-full bg-cedar px-5 py-2.5 text-sm font-semibold text-limestone transition hover:bg-cedar-800">
              Search
            </button>
          </form>

          <dl className="rise mt-10 grid max-w-md grid-cols-3 gap-6" style={{ animationDelay: '320ms' }}>
            {[
              ['2,317', 'trail reviews'],
              ['48.6k', 'hikes logged'],
              ['3,088 m', 'highest summit'],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-display text-2xl font-semibold text-cedar">{v}</dt>
                <dd className="text-xs tracking-wide text-ink/55 uppercase">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rise relative min-h-[420px] md:min-h-[600px]" style={{ animationDelay: '120ms' }}>
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] rounded-tr-[7rem] shadow-2xl shadow-cedar/25">
            <img
              src={img('/img/hero.png', 1100)}
              alt="A hiker walking above the Qadisha Valley at sunset"
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cedar/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 text-limestone">
              <p className="text-xs tracking-[0.2em] uppercase opacity-80">Featured</p>
              <Link
                to="/trails/$slug"
                params={{ slug: 'qadisha-valley' }}
                className="font-display text-2xl font-semibold hover:underline"
              >
                Qadisha Valley Trail
              </Link>
              <p className="text-sm opacity-85">8 km · 4 h · Moderate · Best March–June</p>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-4 w-64 rounded-2xl bg-white p-4 shadow-xl shadow-cedar/15 ring-1 ring-cedar/5 sm:-left-8">
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase" style={{ color: conditionMeta[report.kind].color }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
              </span>
              Live · {conditionMeta[report.kind].label}
            </div>
            <p className="mt-2 text-sm leading-snug text-ink/80">“{report.text}”</p>
            <p className="mt-2 text-xs text-ink/50">
              {report.author} · Baatara Gorge · {report.postedAgo}
            </p>
          </div>

          <div className="absolute top-6 -right-2 hidden items-center gap-3 rounded-2xl bg-cedar/95 py-3 pr-5 pl-3 text-limestone shadow-xl backdrop-blur sm:flex">
            <BadgeMedal badge={badges[1]} size="sm" />
            <div>
              <p className="text-[11px] tracking-wider uppercase opacity-60">Badge unlocked</p>
              <p className="font-display text-base font-semibold">Cedars Guardian</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MapTeaser() {
  const [active, setActive] = useState<string | null>(null)
  const counts = {
    easy: trails.filter((t) => t.difficulty === 'easy').length,
    moderate: trails.filter((t) => t.difficulty === 'moderate').length,
    hard: trails.filter((t) => t.difficulty === 'hard').length,
  }
  return (
    <section className="mx-auto mt-16 max-w-7xl px-5">
      <div className="grid overflow-hidden rounded-[2rem] bg-cedar text-limestone md:grid-cols-[380px_1fr]">
        <div className="flex flex-col justify-between gap-8 p-8 md:p-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-limestone/50 uppercase">Interactive map</p>
            <h2 className="font-display mt-3 text-4xl leading-tight font-semibold">
              The whole country, <em className="font-normal text-clay">pinned.</em>
            </h2>
            <p className="mt-4 leading-relaxed text-limestone/75">
              Every trail is colour-coded by difficulty. Tap a pin for the distance, elevation and photos — then open the
              full trail page.
            </p>
          </div>
          <ul className="space-y-3">
            {(
              [
                ['easy', 'Easy hikes', 'bg-easy'],
                ['moderate', 'Medium hikes', 'bg-moderate'],
                ['hard', 'Difficult hikes', 'bg-hard'],
              ] as const
            ).map(([k, label, bg]) => (
              <li key={k} className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="flex items-center gap-3">
                  <span className={`h-3.5 w-3.5 rounded-full ring-4 ring-white/10 ${bg}`} />
                  {label}
                </span>
                <span className="font-display text-xl">{counts[k]}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/trails"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-limestone px-5 py-3 text-sm font-semibold text-cedar transition hover:bg-white"
          >
            Open the full map <ArrowRight size={16} />
          </Link>
        </div>
        <TrailMap trails={trails} activeSlug={active} onSelect={setActive} className="min-h-[440px] md:min-h-[560px]" />
      </div>
    </section>
  )
}

function FeaturedTrails() {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-5">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-clay uppercase">Top rated this season</p>
          <h2 className="font-display mt-2 text-4xl font-semibold text-cedar">Trails hikers can't stop talking about</h2>
        </div>
        <Link to="/trails" className="hidden items-center gap-1 text-sm font-semibold text-cedar hover:text-clay md:inline-flex">
          All {trails.length} trails <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="-mx-5 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:thin]">
        {featured.map((t) => (
          <div key={t.slug} className="w-[290px] shrink-0 snap-start">
            <TrailCard trail={t} />
          </div>
        ))}
      </div>
    </section>
  )
}

function HiddenPlaces() {
  const cats = Object.keys(categoryMeta) as Category[]
  const spans = ['md:col-span-2 md:row-span-2', '', '', 'md:col-span-2', '', '']
  return (
    <section className="mx-auto mt-24 max-w-7xl px-5">
      <div className="grid gap-6 md:grid-cols-[1fr_2fr] md:items-end">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-clay uppercase">Discover hidden places</p>
          <h2 className="font-display mt-2 text-4xl leading-tight font-semibold text-cedar">
            Not only the famous ones.
          </h2>
        </div>
        <p className="max-w-xl text-ink/65 md:justify-self-end">
          Emerald pools at the bottom of a canyon, a plateau where you can camp under a sky full of stars, a Roman
          temple most Beirutis have never visited. Browse by what you want to find.
        </p>
      </div>
      <div className="mt-10 grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-4">
        {cats.map((c, i) => {
          const meta = categoryMeta[c]
          const count = trails.filter((t) => t.categories.includes(c)).length
          return (
            <Link
              key={c}
              to="/places"
              hash={c}
              className={`group relative overflow-hidden rounded-3xl ${spans[i]}`}
            >
              <img
                src={img(meta.image, i === 0 ? 900 : 500)}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className={`font-display font-semibold ${i === 0 ? 'text-3xl' : 'text-xl'}`}>{meta.label}</p>
                <p className="mt-0.5 text-sm text-white/75">
                  {count} {count === 1 ? 'spot' : 'spots'} · {meta.blurb}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function Community() {
  const featuredReview = reviews[0]
  const reviewTrail = getTrail(featuredReview.trailSlug)!
  return (
    <section className="mt-24 bg-sand/60 py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-clay uppercase">Hiking community</p>
          <h2 className="font-display mt-2 text-4xl leading-tight font-semibold text-cedar">
            Conditions from people who were there <em className="font-normal">this morning.</em>
          </h2>
          <p className="mt-4 max-w-md text-ink/65">
            Post photos, review trails and flag mud, snow or closures. Every report keeps the map honest for the next
            hiker.
          </p>

          <figure className="mt-10 overflow-hidden rounded-3xl bg-white shadow-lg shadow-cedar/5">
            <img src={img(featuredReview.photo!, 800)} alt="" loading="lazy" className="h-48 w-full object-cover" />
            <div className="p-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < featuredReview.rating ? 'fill-moderate text-moderate' : 'text-stone'} />
                ))}
              </div>
              <blockquote className="font-display mt-3 text-xl leading-snug text-cedar">“{featuredReview.text}”</blockquote>
              <figcaption className="mt-4 text-sm text-ink/55">
                {featuredReview.author}, {featuredReview.hometown} — on{' '}
                <Link to="/trails/$slug" params={{ slug: reviewTrail.slug }} className="font-semibold text-clay hover:underline">
                  {reviewTrail.name}
                </Link>
              </figcaption>
            </div>
          </figure>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold text-cedar">
              <MessageCircle size={18} /> Latest trail reports
            </h3>
            <Link to="/community" className="text-sm font-semibold text-clay hover:underline">
              See all
            </Link>
          </div>
          <ul className="space-y-3">
            {conditionReports.slice(0, 6).map((r, i) => {
              const t = getTrail(r.trailSlug)!
              const meta = conditionMeta[r.kind]
              return (
                <li
                  key={r.id}
                  className="rounded-2xl bg-white p-4 ring-1 ring-cedar/5 transition hover:ring-cedar/20"
                  style={{ marginLeft: i % 2 ? '1.5rem' : 0 }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase"
                      style={{ color: meta.color, background: `${meta.color}18` }}
                    >
                      {meta.label}
                    </span>
                    <span className="text-xs text-ink/45">{r.postedAgo}</span>
                  </div>
                  <p className="mt-2 text-[15px] text-ink/85">{r.text}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-ink/50">
                    <Link to="/trails/$slug" params={{ slug: t.slug }} className="inline-flex items-center gap-1 font-medium hover:text-clay">
                      <MapPin size={12} /> {t.name}
                    </Link>
                    <span className="inline-flex items-center gap-1">
                      <ThumbsUp size={12} /> {r.helpful} · {r.author}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Gamification() {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-5">
      <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-clay uppercase">Your hiking passport</p>
          <h2 className="font-display mt-2 text-4xl leading-tight font-semibold text-cedar">
            Every trail you finish leaves a mark.
          </h2>
          <p className="mt-4 text-ink/65">
            Log completed trails, count the mountains you've climbed and unlock badges for exploring every corner of
            the country. Climb the regional leaderboard with friends.
          </p>
          <Link
            to="/passport"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-cedar px-5 py-3 text-sm font-semibold text-limestone transition hover:bg-cedar-800"
          >
            See a hiker passport <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {badges.slice(0, 8).map((b, i) => (
            <div
              key={b.id}
              className="flex flex-col items-center rounded-3xl bg-white p-5 text-center ring-1 ring-cedar/5"
              style={{ transform: `translateY(${i % 2 ? 18 : 0}px)` }}
            >
              <BadgeMedal badge={b} />
              <p className="font-display mt-3 text-sm leading-tight font-semibold text-cedar">{b.name}</p>
              <p className="mt-1 text-[11px] text-ink/50">
                {b.progress >= b.goal ? 'Unlocked' : `${b.progress}/${b.goal}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ClosingCta() {
  return (
    <section className="mx-auto mt-28 max-w-7xl px-5">
      <div className="relative overflow-hidden rounded-[2rem]">
        <img src={img('/img/summit.png', 1400)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-cedar/90 via-cedar/60 to-transparent" />
        <div className="relative max-w-xl px-8 py-16 text-limestone md:px-14 md:py-24">
          <h2 className="font-display text-4xl leading-tight font-semibold md:text-5xl">
            This weekend, go somewhere <em className="font-normal text-clay">new.</em>
          </h2>
          <p className="mt-4 text-limestone/80">
            Filter by difficulty, season and what you want to see. We'll tell you what to pack and where to eat after.
          </p>
          <Link
            to="/trails"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-clay px-6 py-3.5 font-semibold text-white transition hover:bg-clay-600"
          >
            Plan a hike <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
