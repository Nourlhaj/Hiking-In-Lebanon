import { Droplets, Footprints, Landmark, Mountain, Snowflake, Sunrise, Tent, Trees } from 'lucide-react'
import type { Badge } from '@/data/fixtures'

const icons = {
  mountain: Mountain,
  trees: Trees,
  droplets: Droplets,
  landmark: Landmark,
  tent: Tent,
  sunrise: Sunrise,
  footprints: Footprints,
  snowflake: Snowflake,
}

/** Circular medal with a progress ring; greyed out until the badge is earned. */
export default function BadgeMedal({ badge, size = 'md' }: { badge: Badge; size?: 'sm' | 'md' | 'lg' }) {
  const Icon = icons[badge.icon]
  const px = { sm: 44, md: 72, lg: 96 }[size]
  const earned = badge.progress >= badge.goal
  const pct = Math.min(1, badge.progress / badge.goal)
  const r = px / 2 - 3
  const c = 2 * Math.PI * r

  return (
    <div className="relative shrink-0" style={{ width: px, height: px }} title={`${badge.name} — ${badge.description}`}>
      <svg width={px} height={px} className="absolute inset-0 -rotate-90">
        <circle cx={px / 2} cy={px / 2} r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-sand" />
        <circle
          cx={px / 2}
          cy={px / 2}
          r={r}
          fill="none"
          stroke={earned ? '#b85a32' : '#6f8a5b'}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`}
        />
      </svg>
      <div
        className={`absolute inset-[6px] flex items-center justify-center rounded-full ${
          earned ? 'bg-gradient-to-br from-clay to-clay-600 text-white shadow-inner' : 'bg-limestone text-cedar/40'
        }`}
      >
        <Icon size={px * 0.36} strokeWidth={1.8} />
      </div>
    </div>
  )
}
