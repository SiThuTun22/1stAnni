import { motion } from 'framer-motion'
import { COUPLE } from '../config'
import { Petals } from './Petals'
import './Hero.css'

type HeroProps = {
  onExplore: () => void
  daysTogether: number
}

export function Hero({ onExplore, daysTogether }: HeroProps) {
  return (
    <header className="hero">
      <div className="hero__atmosphere" aria-hidden="true">
        <div className="hero__glow hero__glow--left" />
        <div className="hero__glow hero__glow--right" />
        <div className="hero__horizon" />
        <Petals />
      </div>

      <div className="hero__content section-shell">
        <motion.p
          className="hero__brand"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {COUPLE.names}
        </motion.p>

        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {COUPLE.anniversaryLabel}
        </motion.h1>

        <motion.p
          className="hero__lede"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {COUPLE.heroLine}
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <button type="button" className="hero__cta" onClick={onExplore}>
            {COUPLE.ctaLabel}
          </button>
          <p className="hero__meta">{daysTogether} days of us</p>
        </motion.div>
      </div>

      <motion.div
        className="hero__scroll"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span />
      </motion.div>
    </header>
  )
}
