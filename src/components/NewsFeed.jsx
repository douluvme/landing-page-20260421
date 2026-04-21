import { useState, useEffect, useCallback } from 'react'

const HN_BASE = 'https://hacker-news.firebaseio.com/v0'
const REFRESH_MS = 5 * 60 * 1000

const card = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  transition: 'background 0.2s, border-color 0.2s',
}

function SkeletonList() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="h-4 rounded w-5/6" style={{ background: 'var(--skeleton)' }} />
          <div className="h-3 rounded w-1/3" style={{ background: 'var(--skeleton)', opacity: 0.6 }} />
        </div>
      ))}
    </div>
  )
}

export default function NewsFeed() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)

  const fetchStories = useCallback(async () => {
    try {
      const ids = await fetch(`${HN_BASE}/topstories.json`).then(r => r.json())
      const items = await Promise.all(
        ids.slice(0, 10).map(id => fetch(`${HN_BASE}/item/${id}.json`).then(r => r.json()))
      )
      setStories(items.filter(Boolean))
      setLastRefresh(new Date())
      setError(null)
    } catch {
      setError('Failed to load Hacker News stories.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStories()
    const id = setInterval(fetchStories, REFRESH_MS)
    return () => clearInterval(id)
  }, [fetchStories])

  return (
    <section className="p-6 h-full flex flex-col" style={card}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Hacker News
        </h2>
        {lastRefresh && (
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {lastRefresh.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {error && (
        <p className="text-sm p-3 rounded mb-3" style={{ color: 'var(--accent)', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
          {error}
        </p>
      )}

      {loading ? (
        <SkeletonList />
      ) : (
        <ol className="space-y-3 overflow-y-auto flex-1">
          {stories.map((story, i) => (
            <li key={story.id} className="flex gap-3 group">
              <span className="text-sm font-mono w-5 shrink-0 pt-0.5 text-right" style={{ color: 'var(--text-muted)' }}>
                {i + 1}
              </span>
              <div className="min-w-0">
                <a
                  href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium leading-snug line-clamp-2 transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
                >
                  {story.title}
                </a>
                <div className="flex items-center gap-2 mt-0.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span>{story.score} pts</span>
                  <span>·</span>
                  <a
                    href={`https://news.ycombinator.com/item?id=${story.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    {story.descendants ?? 0} comments
                  </a>
                  {story.url && (
                    <>
                      <span>·</span>
                      <span className="truncate max-w-[120px]" style={{ color: 'var(--text-muted)' }}>
                        {new URL(story.url).hostname.replace('www.', '')}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
