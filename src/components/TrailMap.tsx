import { useEffect, useRef } from 'react'
import type * as Leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { difficultyMeta, type Trail } from '@/data/fixtures'
import { formatDuration, img } from '@/lib/img'

interface TrailMapProps {
  trails: Trail[]
  activeSlug?: string | null
  onSelect?: (slug: string) => void
  /** Draw the GPS route of the active trail (or of every trail when only one is passed). */
  showRoute?: boolean
  className?: string
}

const LEBANON_CENTER: [number, number] = [33.93, 35.86]

function pinIcon(L: typeof Leaflet, trail: Trail, active: boolean) {
  return L.divIcon({
    className: '',
    html: `<div class="trail-pin${active ? ' is-active' : ''}" style="background:${difficultyMeta[trail.difficulty].color}"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  })
}

function popupHtml(t: Trail) {
  const d = difficultyMeta[t.difficulty]
  return `
    <a href="/trails/${t.slug}" style="display:block;color:inherit;text-decoration:none">
      <img src="${img(t.photos[0], 480)}" alt="" style="width:100%;height:120px;object-fit:cover;border-radius:14px 14px 0 0" />
      <div style="padding:12px 14px 14px">
        <div style="display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:${d.color};text-transform:uppercase;letter-spacing:.08em">
          <span style="width:8px;height:8px;border-radius:99px;background:${d.color}"></span>${d.label}
        </div>
        <div style="font-family:Fraunces,serif;font-size:17px;font-weight:600;margin:4px 0 2px;color:#1d3328">${t.name}</div>
        <div style="font-size:12px;color:#5b5a52">${t.distanceKm} km · ${formatDuration(t.durationHours)} · ↑${t.elevationGainM} m</div>
        <div style="margin-top:8px;font-size:12px;font-weight:600;color:#b85a32">View full details →</div>
      </div>
    </a>`
}

export default function TrailMap({ trails, activeSlug, onSelect, showRoute, className }: TrailMapProps) {
  const el = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Leaflet.Map | null>(null)
  const LRef = useRef<typeof Leaflet | null>(null)
  const markersRef = useRef<Map<string, Leaflet.Marker>>(new Map())
  const routeRef = useRef<Leaflet.LayerGroup | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const syncRef = useRef(() => {})

  // Create the map once (Leaflet needs `window`, so it is loaded client-side only)
  useEffect(() => {
    let cancelled = false
    let resize: ResizeObserver | undefined
    import('leaflet').then((mod) => {
      if (cancelled || !el.current || mapRef.current) return
      const L = (mod as unknown as { default?: typeof Leaflet }).default ?? (mod as typeof Leaflet)
      LRef.current = L
      const map = L.map(el.current, { zoomControl: false, scrollWheelZoom: false }).setView(LEBANON_CENTER, 9)
      L.control.zoom({ position: 'bottomright' }).addTo(map)
      L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 16,
        attribution: '© OpenStreetMap contributors, SRTM | © OpenTopoMap',
      }).addTo(map)
      map.on('click', () => map.scrollWheelZoom.enable())
      routeRef.current = L.layerGroup().addTo(map)
      mapRef.current = map
      // Keep tiles correct when the container is resized or toggled from hidden
      resize = new ResizeObserver(() => map.invalidateSize())
      resize.observe(el.current)
      syncRef.current()
    })
    return () => {
      cancelled = true
      resize?.disconnect()
      mapRef.current?.remove()
      mapRef.current = null
      markersRef.current.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function syncMarkers() {
    const L = LRef.current
    const map = mapRef.current
    if (!L || !map) return

    const wanted = new Set(trails.map((t) => t.slug))
    for (const [slug, m] of markersRef.current) {
      if (!wanted.has(slug)) {
        m.remove()
        markersRef.current.delete(slug)
      }
    }
    for (const t of trails) {
      const active = t.slug === activeSlug
      let marker = markersRef.current.get(t.slug)
      if (!marker) {
        marker = L.marker(t.start, { icon: pinIcon(L, t, active), title: t.name })
          .bindPopup(popupHtml(t), { closeButton: false, maxWidth: 260 })
          .on('click', () => onSelectRef.current?.(t.slug))
          .addTo(map)
        markersRef.current.set(t.slug, marker)
      } else {
        marker.setIcon(pinIcon(L, t, active))
      }
      marker.setZIndexOffset(active ? 1000 : 0)
    }

    routeRef.current?.clearLayers()
    const routed = showRoute ? (trails.length === 1 ? trails[0] : trails.find((t) => t.slug === activeSlug)) : undefined
    if (routed) {
      const color = difficultyMeta[routed.difficulty].color
      L.polyline(routed.route, { color: '#fff', weight: 8, opacity: 0.9 }).addTo(routeRef.current!)
      const line = L.polyline(routed.route, { color, weight: 4.5 }).addTo(routeRef.current!)
      L.circleMarker(routed.route[routed.route.length - 1], {
        radius: 6,
        color: '#fff',
        weight: 3,
        fillColor: '#1d3328',
        fillOpacity: 1,
      }).addTo(routeRef.current!)
      map.fitBounds(line.getBounds(), { padding: [50, 50], maxZoom: 14 })
    } else if (activeSlug) {
      const t = trails.find((x) => x.slug === activeSlug)
      if (t) {
        map.flyTo(t.start, Math.max(map.getZoom(), 11), { duration: 0.8 })
        markersRef.current.get(t.slug)?.openPopup()
      }
    } else if (trails.length) {
      map.fitBounds(L.latLngBounds(trails.map((t) => t.start)), { padding: [40, 40], maxZoom: 11 })
    }
  }

  syncRef.current = syncMarkers
  useEffect(syncMarkers, [trails, activeSlug, showRoute])

  return (
    <div className={`relative isolate overflow-hidden ${className ?? ''}`}>
      <div ref={el} className="absolute inset-0" />
      <div className="pointer-events-none absolute top-3 left-3 z-[500] flex gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-cedar shadow-sm backdrop-blur">
        {(Object.keys(difficultyMeta) as Array<keyof typeof difficultyMeta>).map((d) => (
          <span key={d} className="flex items-center gap-1 px-1">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: difficultyMeta[d].color }} />
            {difficultyMeta[d].label}
          </span>
        ))}
      </div>
    </div>
  )
}
