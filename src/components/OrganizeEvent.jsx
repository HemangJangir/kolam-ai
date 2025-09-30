import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function OrganizeEvent() {
  const [events, setEvents] = useState([])
  const [newEvent, setNewEvent] = useState({ title: '', description: '', deadline: '' })
  const [activeEventId, setActiveEventId] = useState(null)
  const [submission, setSubmission] = useState({ team: '', imageUrl: '' })

  const activeEvent = useMemo(() => events.find((e) => e.id === activeEventId) || null, [events, activeEventId])

  const createEvent = (e) => {
    e.preventDefault()
    if (!newEvent.title.trim()) return
    const id = `${Date.now()}`
    const evt = { id, ...newEvent, submissions: [] }
    setEvents((prev) => [evt, ...prev])
    setNewEvent({ title: '', description: '', deadline: '' })
    setActiveEventId(id)
  }

  const addSubmission = (e) => {
    e.preventDefault()
    if (!activeEvent) return
    if (!submission.team.trim() || !submission.imageUrl.trim()) return
    setEvents((prev) => prev.map((evt) => {
      if (evt.id !== activeEvent.id) return evt
      const already = evt.submissions.some((s) => s.team.toLowerCase() === submission.team.trim().toLowerCase())
      const sub = { id: `${Date.now()}`, team: submission.team.trim(), imageUrl: submission.imageUrl.trim(), score: null }
      return { ...evt, submissions: already ? evt.submissions : [sub, ...evt.submissions] }
    }))
    setSubmission({ team: '', imageUrl: '' })
  }

  const setScore = (submissionId, score) => {
    setEvents((prev) => prev.map((evt) => {
      if (evt.id !== activeEventId) return evt
      return {
        ...evt,
        submissions: evt.submissions.map((s) => s.id === submissionId ? { ...s, score } : s)
      }
    }))
  }

  const topRanked = useMemo(() => {
    if (!activeEvent) return []
    return [...activeEvent.submissions]
      .filter((s) => typeof s.score === 'number')
      .sort((a, b) => (b.score ?? -Infinity) - (a.score ?? -Infinity))
      .slice(0, 5)
  }, [activeEvent])

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link to="/" className="text-teal hover:text-maroon transition-colors">← Back to Home</Link>
      </div>
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-1 bg-white/70 backdrop-blur rounded-xl shadow p-6 space-y-4"
        >
          <h1 className="text-3xl heading-calligraphy text-maroon">Organize an Event</h1>
          <form onSubmit={createEvent} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Title</label>
              <input
                value={newEvent.title}
                onChange={(e) => setNewEvent((s) => ({ ...s, title: e.target.value }))}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saffron/60"
                placeholder="Pongal Kolam Fest"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Description</label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent((s) => ({ ...s, description: e.target.value }))}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saffron/60"
                placeholder="Invite participants to upload their Kolam artworks"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Submission Deadline</label>
              <input
                type="date"
                value={newEvent.deadline}
                onChange={(e) => setNewEvent((s) => ({ ...s, deadline: e.target.value }))}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saffron/60"
              />
            </div>
            <button className="btn-gold px-4 py-2 rounded font-semibold">Create Event</button>
          </form>

          {events.length > 0 && (
            <div className="pt-4">
              <h3 className="text-lg font-semibold text-maroon mb-2">Your Events</h3>
              <ul className="space-y-2">
                {events.map((evt) => (
                  <li key={evt.id}>
                    <button
                      onClick={() => setActiveEventId(evt.id)}
                      className={`w-full text-left px-3 py-2 rounded border transition ${activeEventId === evt.id ? 'bg-saffron/10 border-saffron/50' : 'hover:bg-gray-50'}`}
                    >
                      <div className="font-medium">{evt.title}</div>
                      <div className="text-xs text-gray-600">Deadline: {evt.deadline || '—'}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="lg:col-span-2 space-y-6"
        >
          {!activeEvent && (
            <div className="bg-white/60 backdrop-blur rounded-xl shadow p-8 text-center text-gray-700">
              Create or select an event to manage submissions and scoring.
            </div>
          )}

          {activeEvent && (
            <div className="space-y-6">
              <div className="bg-white/70 backdrop-blur rounded-xl shadow p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-maroon">{activeEvent.title}</h2>
                    <p className="text-gray-700 mt-1">{activeEvent.description}</p>
                    <p className="text-sm text-gray-600 mt-1">Deadline: {activeEvent.deadline || '—'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-maroon mb-3">Submit Your Kolam</h3>
                <form onSubmit={addSubmission} className="grid sm:grid-cols-3 gap-3">
                  <input
                    value={submission.team}
                    onChange={(e) => setSubmission((s) => ({ ...s, team: e.target.value }))}
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saffron/60"
                    placeholder="Team name"
                  />
                  <input
                    value={submission.imageUrl}
                    onChange={(e) => setSubmission((s) => ({ ...s, imageUrl: e.target.value }))}
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saffron/60"
                    placeholder="Image URL"
                  />
                  <button className="btn-gold px-4 py-2 rounded font-semibold">Upload</button>
                </form>
              </div>

              <div className="bg-white/70 backdrop-blur rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-maroon mb-4">Submissions</h3>
                {activeEvent.submissions.length === 0 && (
                  <p className="text-gray-600">No submissions yet.</p>
                )}
                <div className="grid md:grid-cols-2 gap-4">
                  {activeEvent.submissions.map((s) => (
                    <div key={s.id} className="border rounded-lg overflow-hidden bg-white/80">
                      <div className="aspect-video bg-gray-100">
                        {s.imageUrl && (
                          <img src={s.imageUrl} alt={s.team} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="p-4 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-medium">{s.team}</div>
                          <div className="text-sm text-gray-600">Score: {s.score ?? '—'}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={s.score ?? ''}
                            onChange={(e) => setScore(s.id, e.target.value === '' ? null : Math.max(0, Math.min(100, Number(e.target.value))))}
                            className="w-20 border rounded px-2 py-1"
                            placeholder="0-100"
                          />
                          <span className="text-sm text-gray-500">/100</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {topRanked.length > 0 && (
                <div className="bg-white/80 backdrop-blur rounded-xl shadow p-6">
                  <h3 className="text-lg font-semibold text-maroon mb-3">Top Teams</h3>
                  <ol className="list-decimal list-inside space-y-1">
                    {topRanked.map((t, idx) => (
                      <li key={t.id} className="flex items-center justify-between">
                        <span>{idx + 1}. {t.team}</span>
                        <span className="font-semibold">{t.score}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
}


