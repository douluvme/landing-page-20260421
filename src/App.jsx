import { useState, useEffect } from 'react'
import Clock from './components/Clock'
import Weather from './components/Weather'
import NewsFeed from './components/NewsFeed'
import { THEMES } from './themes'

function useTheme() {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem('theme-preset') || 'minimal'
  )
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme-dark')
    if (saved !== null) return saved === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const el = document.documentElement
    THEMES.forEach(t => el.classList.remove(`theme-${t.id}`))
    if (theme !== 'minimal') el.classList.add(`theme-${theme}`)
    el.classList.toggle('dark', dark)
    localStorage.setItem('theme-preset', theme)
    localStorage.setItem('theme-dark', String(dark))
  }, [theme, dark])

  const setTheme = (id) => setThemeState(id)
  const toggleDark = () => setDark(d => !d)

  return { theme, dark, setTheme, toggleDark }
}

export default function App() {
  const { theme, dark, setTheme, toggleDark } = useTheme()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', fontFamily: 'var(--font)' }}>
      <Clock
        dark={dark}
        theme={theme}
        onToggleTheme={toggleDark}
        onSetTheme={setTheme}
      />
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 items-start">
        <Weather />
        <NewsFeed />
      </main>
    </div>
  )
}
