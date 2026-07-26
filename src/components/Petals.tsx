import { motion } from 'framer-motion'
import './Petals.css'

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${6 + ((i * 7) % 88)}%`,
  delay: (i % 7) * 0.8,
  duration: 12 + (i % 5) * 2.2,
  size: 10 + (i % 4) * 4,
  drift: i % 2 === 0 ? 40 : -35,
  rotate: 180 + i * 25,
}))

export function Petals() {
  return (
    <div className="petals" aria-hidden="true">
      {PETALS.map((p) => (
        <motion.span
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 1.35,
          }}
          initial={{ y: '-10vh', opacity: 0, rotate: 0, x: 0 }}
          animate={{
            y: '110vh',
            opacity: [0, 0.75, 0.75, 0],
            rotate: p.rotate,
            x: [0, p.drift, p.drift * -0.4],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
