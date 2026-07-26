import { useId, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { COUPLE, GATE } from '../config'
import './Gate.css'

type GateProps = {
  onUnlock: () => void
}

/** Keep only digits, max 8 (DDMMYYYY) */
function digitsOnly(value: string) {
  return value.replace(/\D/g, '').slice(0, 8)
}

/** Show DD-MM-YYYY while typing on a number pad (no dash key needed) */
function formatDateInput(value: string) {
  const digits = digitsOnly(value)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`
}

/** Normalize to DD-MM-YYYY — accepts 26-07-2025, 26-7-2025, or 26072025 */
function normalizeDate(value: string) {
  const digits = digitsOnly(value)
  if (digits.length === 8) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`
  }

  const cleaned = value.trim().replace(/[./]/g, '-')
  const match = cleaned.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/)
  if (!match) return null
  const day = match[1].padStart(2, '0')
  const month = match[2].padStart(2, '0')
  const year = match[3]
  return `${day}-${month}-${year}`
}

export function Gate({ onUnlock }: GateProps) {
  const inputId = useId()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(0)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const entered = normalizeDate(value)
    const expected = normalizeDate(GATE.dateDisplay)

    if (!entered || entered !== expected) {
      setError('Not quite — try our anniversary day again.')
      setShake((n) => n + 1)
      return
    }

    localStorage.setItem(GATE.storageKey, '1')
    onUnlock()
  }

  return (
    <div className="gate">
      <div className="gate__glow gate__glow--left" aria-hidden="true" />
      <div className="gate__glow gate__glow--right" aria-hidden="true" />

      <motion.div
        className="gate__card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="gate__brand">{COUPLE.names}</p>
        <h1 className="gate__title">A little key</h1>
        <p className="gate__lede">
          Enter our anniversary day to open this scrapbook.
        </p>

        <motion.form
          className="gate__form"
          onSubmit={handleSubmit}
          key={shake}
          initial={shake ? { x: 0 } : false}
          animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : undefined}
          transition={{ duration: 0.4 }}
        >
          <label className="gate__label" htmlFor={inputId}>
            Anniversary day
          </label>
          <p className="gate__format">
            Format: <strong>{GATE.formatHint}</strong>
            <span className="gate__format-note">
              {' '}
              — on phone, just type the numbers
            </span>
          </p>
          <input
            id={inputId}
            className="gate__input"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            enterKeyHint="go"
            placeholder={GATE.formatHint}
            value={value}
            onChange={(e) => {
              setValue(formatDateInput(e.target.value))
              if (error) setError('')
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
          />
          {error ? (
            <p id={`${inputId}-error`} className="gate__error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="gate__submit">
            Open our year
          </button>
        </motion.form>
      </motion.div>
    </div>
  )
}
