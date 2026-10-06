/** Serve local images through the Netlify Image CDN at a sensible width. */
export function img(src: string, width: number) {
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&fm=webp&q=72`
}

export function formatDuration(hours: number) {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (!h) return `${m} min`
  return m ? `${h} h ${m} min` : `${h} h`
}
