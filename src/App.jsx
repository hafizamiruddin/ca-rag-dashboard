import { useEffect, useState } from 'react'
import Hero        from './components/Hero.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Analysis    from './components/Analysis.jsx'
import Grounding   from './components/Grounding.jsx'
import Findings    from './components/Findings.jsx'
import Explorer    from './components/Explorer.jsx'
import DemoVideo   from './components/DemoVideo.jsx'
import Methodology from './components/Methodology.jsx'
import Footer      from './components/Footer.jsx'
import meta from '../data/project-meta.json'

const NAV = [
  { id:'s0', label:'Overview'    },
  { id:'s1', label:'Leaderboard' },
  { id:'s2', label:'Analysis'    },
  { id:'s3', label:'Behaviour'   },
  { id:'s4', label:'Findings'    },
  { id:'s5', label:'Explorer'    },
  { id:'s6', label:'Demo'        },
  { id:'s7', label:'Methodology' },
]

export default function App() {
  const [active, setActive] = useState('s0')
  const [open, setOpen]     = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) })
    }, { rootMargin: '-35% 0px -60% 0px', threshold: 0 })

    NAV.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <>
      {/* ── sticky nav ── */}
      <nav className="nav">
        <div className="nav-in">
          <span className="nav-brand">
            CA‑RAG <span>//</span> {meta.project_id}
          </span>

          <div className="nav-links">
            {NAV.map(({ id, label }) => (
              <a key={id} href={`#${id}`} className={`nl${active===id?' on':''}`}
                onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
          </div>

          <button className="nav-mob tb" onClick={() => setOpen(o => !o)}
            style={{ padding:'5px 12px', fontSize:'12px' }}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* ── mobile overlay ── */}
      {open && (
        <div className="mob-menu" onClick={() => setOpen(false)}>
          {NAV.map(({ id, label }) => (
            <a key={id} href={`#${id}`}
              className={`mob-link${active===id?' on':''}`}
              onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </div>
      )}

      {/* ── sections ── */}
      <div style={{ paddingTop:56 }}>
        <section id="s0"><Hero /></section>
        <section id="s1"><Leaderboard /></section>
        <section id="s2"><Analysis /></section>
        <section id="s3"><Grounding /></section>
        <section id="s4"><Findings /></section>
        <section id="s5"><Explorer /></section>
        <section id="s6"><DemoVideo /></section>
        <section id="s7"><Methodology /></section>
        <Footer />
      </div>
    </>
  )
}
