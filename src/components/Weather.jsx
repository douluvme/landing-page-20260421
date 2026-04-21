import { useState, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

const card = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  transition: 'background 0.2s, border-color 0.2s',
}

const subtleCard = {
  background: 'var(--bg-subtle)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
}

function SkeletonCard() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-6 rounded w-1/2" style={{ background: 'var(--skeleton)' }} />
      <div className="h-16 rounded" style={{ background: 'var(--skeleton)' }} />
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="flex-1 h-20 rounded" style={{ background: 'var(--skeleton)' }} />
        ))}
      </div>
    </div>
  )
}

export default function Weather() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!API_KEY) {
      setError('Set VITE_WEATHER_API_KEY in .env to enable weather.')
      return
    }
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=auto:ip&days=3&aqi=no`)
      .then(r => {
        if (!r.ok) throw new Error(`WeatherAPI error ${r.status}`)
        return r.json()
      })
      .then(setData)
      .catch(e => setError(e.message))
  }, [])

  if (error) {
    return (
      <section className="p-6 h-full" style={card}>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>
          Weather
        </h2>
        <p className="text-sm p-3 rounded" style={{ color: 'var(--accent)', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
          {error}
        </p>
      </section>
    )
  }

  if (!data) {
    return (
      <section className="p-6 h-full" style={card}>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>
          Weather
        </h2>
        <SkeletonCard />
      </section>
    )
  }

  const { current, forecast, location } = data

  return (
    <section className="p-6 h-full" style={card}>
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>
        Weather — {location.name}, {location.country}
      </h2>

      <div className="flex items-center gap-4 mb-6">
        <img src={`https:${current.condition.icon}`} alt={current.condition.text} className="w-14 h-14" />
        <div>
          <div className="text-5xl font-light" style={{ color: 'var(--text-primary)' }}>
            {Math.round(current.temp_c)}°
          </div>
          <div className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {current.condition.text}
          </div>
        </div>
        <div className="ml-auto text-right text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
          <div>Feels like {Math.round(current.feelslike_c)}°</div>
          <div>Humidity {current.humidity}%</div>
          <div>Wind {Math.round(current.wind_kph)} km/h</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {forecast.forecastday.map(day => (
          <div key={day.date} className="flex flex-col items-center gap-1 p-3" style={subtleCard}>
            <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <img src={`https:${day.day.condition.icon}`} alt={day.day.condition.text} className="w-8 h-8" />
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {Math.round(day.day.maxtemp_c)}° / {Math.round(day.day.mintemp_c)}°
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
