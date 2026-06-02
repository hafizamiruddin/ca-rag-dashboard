import { motion } from 'framer-motion'
import meta    from '../../data/project-meta.json'
import results from '../../data/results.json'

const fade = (delay=0) => ({
  initial: { opacity:0, y:20 },
  animate: { opacity:1, y:0 },
  transition: { duration:.6, delay, ease:'easeOut' },
})

export default function Hero() {
  const cfgs = results.configurations
  const meanAbs = (cfgs.reduce((s,c) => s + c.trivia_reject_pct, 0) / cfgs.length).toFixed(1)
  const bestF1  = Math.max(...cfgs.map(c => c.triviaqa.f1))

  const kpis = [
    { val: bestF1.toFixed(4), label:'Best BERTScore F1',   sub:'TriviaQA',               color:'var(--green)'  },
    { val: '12',              label:'Configurations',       sub:'2 × 2 × 3 factorial',    color:'var(--teal)'   },
    { val: '2',               label:'Datasets',             sub:'TriviaQA · SQuAD',       color:'var(--gold)'   },
    { val: `~${meanAbs}%`,    label:'Mean Abstention',      sub:'"no context provided"',  color:'var(--coral)'  },
  ]

  return (
    <div style={{
      position:'relative', minHeight:'100vh', display:'flex', alignItems:'center',
      background:'radial-gradient(ellipse 90% 55% at 50% -5%, rgba(79,209,197,.07) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 85% 65%, rgba(232,163,61,.06) 0%, transparent 55%)',
      overflow:'hidden',
    }}>
      {/* dot grid */}
      <div style={{
        position:'absolute', inset:0, opacity:.04,
        backgroundImage:'radial-gradient(var(--border) 1px, transparent 1px)',
        backgroundSize:'32px 32px',
      }} />

      <div className="sw" style={{ position:'relative', zIndex:1, paddingTop:120, paddingBottom:100 }}>

        <motion.span className="eyebrow" {...fade(0)}>
          Final Year Project · BCS · IIUM · Document Question Answering
        </motion.span>

        <motion.h1 {...fade(.08)} style={{
          fontFamily:'var(--fd)', fontSize:'clamp(36px, 5.5vw, 66px)',
          fontWeight:900, lineHeight:1.05, marginBottom:28, maxWidth:820,
        }}>
          Context-Aware{' '}
          <em style={{ fontStyle:'italic', color:'var(--gold)' }}>
            Retrieval-Augmented Generation
          </em>
          {' '}for Document QA
        </motion.h1>

        <motion.p {...fade(.16)} style={{
          fontSize:17, lineHeight:1.8, color:'var(--text-muted)',
          maxWidth:640, marginBottom:36,
        }}>
          CA-RAG eliminates the top-k retrieval bottleneck by sending every document
          chunk to the language model and generating a candidate answer per chunk.
          Each answer is then validated against its source chunk using cosine
          similarity or dot product — keeping only genuinely grounded responses and
          discarding the rest as "no context provided".
        </motion.p>

        {/* meta chips */}
        <motion.div {...fade(.22)} style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:56 }}>
          {[
            { k:'Supervisor', v: meta.supervisor },
            { k:'Generator',  v:'Zephyr-7B-Beta (4-bit)' },
            { k:'Hardware',   v:'1× RTX 4090' },
            ...meta.authors.map(a => ({ k:'Author', v: a.name })),
          ].map((c,i) => (
            <div key={i} style={{
              fontFamily:'var(--fm)', fontSize:11,
              background:'var(--bg-elevated)', border:'1px solid var(--border)',
              borderRadius:7, padding:'5px 12px',
            }}>
              <span style={{ color:'var(--text-faint)', textTransform:'uppercase', letterSpacing:'.06em', marginRight:5 }}>{c.k}</span>
              <span style={{ color:'var(--text)' }}>{c.v}</span>
            </div>
          ))}
        </motion.div>

        {/* KPI cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))', gap:16 }}>
          {kpis.map((k,i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:30 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:.55, delay:.3 + i*.09, ease:'easeOut' }}
              style={{
                background:'var(--bg-panel)', border:`1px solid ${k.color}22`,
                borderRadius:'var(--radius)', padding:'24px 26px', position:'relative', overflow:'hidden',
              }}>
              <div style={{
                position:'absolute', top:0, left:0, right:0, height:3,
                background:`linear-gradient(90deg, ${k.color} 0%, transparent 100%)`,
              }} />
              <div style={{
                fontFamily:'var(--fm)', fontSize:'clamp(26px,2.8vw,34px)',
                fontWeight:700, color:k.color, marginBottom:4,
              }}>{k.val}</div>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--text)', marginBottom:3 }}>{k.label}</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:10, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'.08em' }}>{k.sub}</div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  )
}
