import { useState, useEffect } from 'react'
import { THEMES } from '../themes'

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  )
}

export default function Clock({ dark, theme, onToggleTheme, onSetTheme }) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const time = now.toLocaleTimeString('en-US', { hour12: false })
  const date = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div
      className="relative flex flex-col items-center justify-center py-10 transition-colors duration-200"
      style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {/* Theme dots */}
        {THEMES.map(t => (
          <button
            key={t.id}
            onClick={() => onSetTheme(t.id)}
            title={t.label}
            aria-label={`Switch to ${t.label} theme`}
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: t.dot,
              outline: theme === t.id ? `2px solid ${t.dot}` : 'none',
              outlineOffset: 2,
              border: 'none',
              cursor: 'pointer',
              opacity: theme === t.id ? 1 : 0.45,
              transition: 'opacity 0.15s, outline 0.15s',
              padding: 0,
            }}
          />
        ))}

        {/* Divider */}
        <span style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 2px' }} />

        {/* Dark toggle */}
        <button
          onClick={onToggleTheme}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-1.5 rounded-md transition-colors"
          style={{
            color: 'var(--text-secondary)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>

      {/* Clock */}
      <div
        className="text-7xl font-light tracking-tight tabular-nums glow transition-colors duration-200"
        style={{ color: 'var(--text-primary)' }}
      >
        {time}
      </div>
      <div
        className="mt-2 text-lg font-medium transition-colors duration-200"
        style={{ color: 'var(--text-secondary)' }}
      >
        {date}
      </div>
    </div>
  )
}
