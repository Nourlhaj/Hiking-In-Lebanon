import { Link } from '@tanstack/react-router'
import Logo from './Logo'

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-cedar text-limestone/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Logo className="h-9 w-9" />
            <span className="font-display text-2xl text-limestone">
              Lebanon <em className="text-clay">Trails</em>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Trail reviews like TripAdvisor, progress tracking like Strava — made only for hiking in Lebanon, from the
            Akkar highlands to the hills of Jezzine.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-semibold tracking-[0.2em] text-limestone/50 uppercase">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/trails" className="hover:text-white">Trail map</Link></li>
            <li><Link to="/places" className="hover:text-white">Hidden places</Link></li>
            <li><Link to="/community" className="hover:text-white">Trail conditions</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-semibold tracking-[0.2em] text-limestone/50 uppercase">Hike responsibly</h3>
          <p className="text-sm leading-relaxed">
            Stay on marked paths, carry your trash out, and check conditions before you go. In an emergency call the
            Lebanese Red Cross on <strong className="text-white">140</strong>.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-limestone/50">
        © {new Date().getFullYear()} Lebanon Trails · Map data © OpenStreetMap contributors
      </div>
    </footer>
  )
}
