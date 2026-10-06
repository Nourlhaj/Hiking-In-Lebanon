export default function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="#1d3328" />
      <path d="M6 29 L15 15 L20 22 L25 12 L34 29 Z" fill="#f4efe4" />
      <path d="M25 12 L28.5 18.5 L26 17.5 L24 19.5 L22.3 17.4 Z" fill="#1d3328" opacity=".35" />
      <path d="M8 31 C14 27, 22 33, 32 29" stroke="#b85a32" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeDasharray="0.1 4" />
    </svg>
  )
}
