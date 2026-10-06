import { createFileRoute } from '@tanstack/react-router'
import { Award, Footprints, MapPin, Mountain, TrendingUp } from 'lucide-react'
import BadgeMedal from '@/components/BadgeMedal'
import TrailCard from '@/components/TrailCard'
import TrailMap from '@/components/TrailMap'
import { badges, getTrail, hiker, leaderboard } from '@/data/fixtures'

export const Route = createFileRoute('/passport')({
  head: () => ({ meta: [{ title: 'Hiker passport — badges & progress | Lebanon Trails' }] }),
  component: Passport,
})

function Passport() {
  const completed = hiker.completedSlugs.map((s) => getTrail(s)!).filter(Boolean)
  const wishlist = hiker.wishlistSlugs.map((s) => getTrail(s)!).filter(Boolean)
  const earned = badges.filter((b) => b.progress >= b.goal)
  const next = badges.filter((b) => b.progress < b.goal).sort((a, b) => b.progress / b.goal - a.progress / a.goal)

  const stats = [
    { label: 'Trails completed', value: hiker.stats.trailsCompleted, icon: Footprints },
    { label: 'Kilometres hiked', value: hiker.stats.kmHiked, icon: TrendingUp },
    { label: 'Metres climbed', value: hiker.stats.elevationM.toLocaleString(), icon: Mountain },
    { label: 'Mountains climbed', value: hiker.stats.peaksClimbed, icon: Award },
  ]

  return (
    <div className="mx-auto max-w-7xl px-5 pt-10">
      <section className="topo relative overflow-hidden rounded-[2rem] bg-white p-8 ring-1 ring-cedar/10 md:p-10">
        <div className="flex flex-wrap items-center gap-6">
          <span className="font-display flex h-24 w-24 items-center justify-center rounded-full bg-cedar text-3xl font-semibold text-limestone ring-4 ring-clay/30">
            RH
          </span>
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-clay uppercase">Hiker passport</p>
            <h1 className="font-display text-4xl font-semibold text-cedar">{hiker.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/55">
              <MapPin size={14} /> {hiker.hometown} · {hiker.handle} · hiking since {hiker.memberSince}
            </p>
          </div>
          <div className="ml-auto flex -space-x-3">
            {earned.map((b) => (
              <BadgeMedal key={b.id} badge={b} size="sm" />
            ))}
          </div>
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl bg-limestone p-5">
              <Icon size={18} className="text-clay" />
              <dd className="font-display mt-3 text-3xl font-semibold text-cedar">{value}</dd>
              <dt className="text-xs tracking-wide text-ink/55 uppercase">{label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl font-semibold text-cedar">Badges</h2>
        <p className="mt-1 text-ink/55">
          {earned.length} of {badges.length} unlocked · next up: <strong className="text-cedar">{next[0]?.name}</strong>
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((b) => {
            const done = b.progress >= b.goal
            return (
              <div
                key={b.id}
                className={`flex items-center gap-4 rounded-3xl p-5 ring-1 ${done ? 'bg-white ring-clay/30' : 'bg-white/60 ring-cedar/10'}`}
              >
                <BadgeMedal badge={b} />
                <div className="min-w-0">
                  <p className="font-display leading-tight font-semibold text-cedar">{b.name}</p>
                  <p className="mt-0.5 text-xs text-ink/55">{b.description}</p>
                  <p className={`mt-1.5 text-xs font-semibold ${done ? 'text-clay' : 'text-moss'}`}>
                    {done ? 'Unlocked' : `${b.progress} / ${b.goal}`}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-14 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="font-display text-3xl font-semibold text-cedar">Where Rami has hiked</h2>
          <TrailMap trails={completed} className="mt-5 h-[380px] rounded-3xl ring-1 ring-cedar/10" />
        </div>
        <div>
          <h2 className="font-display text-3xl font-semibold text-cedar">Leaderboard</h2>
          <p className="mt-1 text-sm text-ink/55">Kilometres hiked this season</p>
          <ol className="mt-5 overflow-hidden rounded-3xl bg-white ring-1 ring-cedar/10">
            {leaderboard.map((p, i) => {
              const me = p.name === hiker.name
              return (
                <li key={p.name} className={`flex items-center gap-4 border-b border-cedar/5 px-5 py-4 last:border-0 ${me ? 'bg-clay/10' : ''}`}>
                  <span className={`font-display w-6 text-xl ${i < 3 ? 'text-clay' : 'text-ink/40'}`}>{i + 1}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-cedar">
                      {p.name} {me && <span className="text-xs font-medium text-clay">(you)</span>}
                    </p>
                    <p className="text-xs text-ink/50">
                      {p.region} · {p.trails} trails
                    </p>
                  </div>
                  <span className="font-display text-lg font-semibold text-cedar">{p.km} km</span>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl font-semibold text-cedar">Completed trails</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {completed.map((t) => (
            <TrailCard key={t.slug} trail={t} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl font-semibold text-cedar">Wishlist</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {wishlist.map((t) => (
            <TrailCard key={t.slug} trail={t} compact />
          ))}
        </div>
      </section>
    </div>
  )
}
