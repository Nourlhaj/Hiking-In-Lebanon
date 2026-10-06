import { Link } from '@tanstack/react-router'
import { Clock, Mountain, Route as RouteIcon, Star } from 'lucide-react'
import { difficultyMeta, type Difficulty, type Trail } from '@/data/fixtures'
import { formatDuration, img } from '@/lib/img'

export function DifficultyPill({ difficulty, className = '' }: { difficulty: Difficulty; className?: string }) {
  const d = difficultyMeta[difficulty]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase shadow-sm ${d.textClass} ${className}`}
    >
      <span className={`h-2 w-2 rounded-full ${d.bgClass}`} />
      {d.label}
    </span>
  )
}

export function TrailStats({ trail, className = '' }: { trail: Trail; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink/65 ${className}`}>
      <span className="inline-flex items-center gap-1.5">
        <RouteIcon size={14} /> {trail.distanceKm} km
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock size={14} /> {formatDuration(trail.durationHours)}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Mountain size={14} /> ↑{trail.elevationGainM} m
      </span>
    </div>
  )
}

export default function TrailCard({
  trail,
  active,
  onHover,
  compact,
}: {
  trail: Trail
  active?: boolean
  onHover?: (slug: string | null) => void
  compact?: boolean
}) {
  return (
    <Link
      to="/trails/$slug"
      params={{ slug: trail.slug }}
      onMouseEnter={() => onHover?.(trail.slug)}
      onFocus={() => onHover?.(trail.slug)}
      className={`group block overflow-hidden rounded-2xl bg-white ring-1 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cedar/10 ${
        active ? 'ring-2 ring-clay' : 'ring-cedar/10'
      } ${compact ? 'flex gap-0' : ''}`}
    >
      <div className={`relative overflow-hidden ${compact ? 'w-32 shrink-0' : 'aspect-[4/3]'}`}>
        <img
          src={img(trail.photos[0], compact ? 300 : 640)}
          alt={trail.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        {!compact && <DifficultyPill difficulty={trail.difficulty} className="absolute top-3 left-3" />}
        {!compact && trail.hiddenGem && (
          <span className="absolute top-3 right-3 rounded-full bg-cedar/90 px-2.5 py-1 text-[11px] font-semibold text-limestone">
            Hidden gem
          </span>
        )}
      </div>
      <div className="flex-1 p-4">
        {compact && <DifficultyPill difficulty={trail.difficulty} className="mb-1.5 !bg-sand/60 !shadow-none" />}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-snug font-semibold text-cedar">{trail.name}</h3>
          <span className="mt-1 inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-ink/80">
            <Star size={14} className="fill-moderate text-moderate" /> {trail.rating}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-ink/55">{trail.location}</p>
        <TrailStats trail={trail} className="mt-3" />
      </div>
    </Link>
  )
}
