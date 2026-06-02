import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import predictions from '../../data/predictions-sample.json'
import results     from '../../data/results.json'

const PAGE_SIZE = 8
const FILTERS   = ['All', 'Answered', 'Abstained']

function getF1(configName) {
  const c = results.configurations.find(x => x.config === configName)
  return c ? c.triviaqa.f1 : null
}
function getMeta(configName) {
  const c = results.configurations.find(x => x.config === configName)
  return c ? { rej: c.trivia_reject_pct, grnd: c.trivia_grounding_pct } : null
}

export default function Explorer() {
  const configNames = Object.keys(predictions.samples)
  const [cfg,   setCfg]   = useState(configNames[0])
  const [filt,  setFilt]  = useState('All')
  const [query, setQuery] = useState('')
  const [page,  setPage]  = useState(1)

  const allSamples = predictions.samples[cfg] || []

  const visible = useMemo(() => {
    let s = allSamples
    if (filt === 'Answered')  s = s.filter(x => !x.rej)
    if (filt === 'Abstained') s = s.filter(x =>  x.rej)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      s = s.filter(x => x.gt.toLowerCase().includes(q))
    }
    return s
  }, [allSamples, filt, query])

  const paginated = visible.slice(0, page * PAGE_SIZE)
  const hasMore   = paginated.length < visible.length

  const meta = getMeta(cfg)
  const f1   = getF1(cfg)

  return (
    <div className="sw">
      <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
        transition={{ duration:.5 }} viewport={{ once:true, margin:'-80px' }}>

        <span className="eyebrow">S5 — Qualitative</span>
        <h2 className="section-title">Prediction Explorer</h2>
        <p className="section-desc">
          Browse 60 TriviaQA samples per configuration. Filter by outcome, search by
          gold answer, or compare abstained vs. answered responses.
        </p>

        {/* controls */}
        <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginBottom:24, alignItems:'flex-end' }}>

          {/* config dropdown */}
          <div style={{ flex:'1 1 280px' }}>
            <label style={{ fontFamily:'var(--fm)', fontSize:10, color:'var(--text-faint)',
              textTransform:'uppercase', letterSpacing:'.1em', display:'block', marginBottom:6 }}>
              Configuration
            </label>
            <select value={cfg} onChange={e => { setCfg(e.target.value); setPage(1) }}
              style={{
                width:'100%', fontFamily:'var(--fm)', fontSize:12,
                background:'var(--bg-elevated)', color:'var(--text)',
                border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px',
                outline:'none', cursor:'pointer',
              }}>
              {configNames.map(n => {
                const f = getF1(n)
                return (
                  <option key={n} value={n}>
                    {n}{f!=null ? `  (F1 ${f.toFixed(4)})` : ''}
                  </option>
                )
              })}
            </select>
          </div>

          {/* filter */}
          <div>
            <div style={{ fontFamily:'var(--fm)', fontSize:10, color:'var(--text-faint)',
              textTransform:'uppercase', letterSpacing:'.1em', marginBottom:6 }}>Filter</div>
            <div className="tg">
              {FILTERS.map(f => (
                <button key={f} className={`tb${filt===f?' on':''}`}
                  onClick={() => { setFilt(f); setPage(1) }}>{f}</button>
              ))}
            </div>
          </div>

          {/* search */}
          <div style={{ flex:'1 1 200px' }}>
            <label style={{ fontFamily:'var(--fm)', fontSize:10, color:'var(--text-faint)',
              textTransform:'uppercase', letterSpacing:'.1em', display:'block', marginBottom:6 }}>
              Search gold answer
            </label>
            <input
              type="text" value={query} placeholder="e.g. Paris"
              onChange={e => { setQuery(e.target.value); setPage(1) }}
              style={{
                width:'100%', fontFamily:'var(--fm)', fontSize:12,
                background:'var(--bg-elevated)', color:'var(--text)',
                border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px',
                outline:'none',
              }}
            />
          </div>
        </div>

        {/* meta line */}
        {meta && (
          <div style={{
            fontFamily:'var(--fm)', fontSize:11, color:'var(--text-faint)',
            marginBottom:20, display:'flex', gap:24, flexWrap:'wrap',
          }}>
            <span>
              <span style={{ color:'var(--coral)' }}>{meta.rej}%</span> abstention on all 500 questions
            </span>
            <span>
              <span style={{ color:'var(--teal)' }}>{meta.grnd}%</span> answer grounding
            </span>
            <span>
              Showing <span style={{ color:'var(--text)' }}>{visible.length}</span> / {allSamples.length} samples
            </span>
          </div>
        )}

        {/* sample cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <AnimatePresence initial={false}>
            {paginated.map((s, i) => (
              <motion.div key={`${cfg}-${s.i}`}
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-10 }}
                transition={{ duration:.25, delay: Math.min(i,.5)*.03 }}
                style={{
                  background:'var(--bg-panel)',
                  borderRadius:10,
                  border:`1px solid ${s.rej ? 'rgba(242,118,107,.25)' : 'var(--border)'}`,
                  borderLeft:`4px solid ${s.rej ? 'var(--coral)' : 'var(--teal)'}`,
                  padding:'16px 18px',
                }}>

                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, flexWrap:'wrap' }}>
                  <span style={{ fontFamily:'var(--fm)', fontSize:10, color:'var(--text-faint)' }}>
                    Q#{s.i}
                  </span>
                  <span className="badge" style={{
                    background: s.rej ? 'rgba(242,118,107,.12)' : 'rgba(79,209,197,.1)',
                    color: s.rej ? 'var(--coral)' : 'var(--teal)',
                    border: `1px solid ${s.rej ? 'rgba(242,118,107,.25)' : 'rgba(79,209,197,.2)'}`,
                  }}>
                    {s.rej ? 'Abstained' : 'Answered'}
                  </span>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr)', gap:16 }}>
                  <div>
                    <div style={{ fontFamily:'var(--fm)', fontSize:9, color:'var(--text-faint)',
                      textTransform:'uppercase', letterSpacing:'.12em', marginBottom:5 }}>Gold Answer</div>
                    <div style={{ fontFamily:'var(--fb)', fontSize:14, fontWeight:600,
                      color:'var(--gold)', lineHeight:1.5 }}>{s.gt}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily:'var(--fm)', fontSize:9, color:'var(--text-faint)',
                      textTransform:'uppercase', letterSpacing:'.12em', marginBottom:5 }}>Model Output</div>
                    <div style={{
                      fontSize:13, color: s.rej ? 'var(--coral)' : 'var(--text-muted)',
                      lineHeight:1.65, fontStyle: s.rej ? 'italic' : 'normal',
                      display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical', overflow:'hidden',
                    }}>{s.pred}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {visible.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 0', color:'var(--text-muted)',
            fontFamily:'var(--fm)', fontSize:12 }}>
            No samples match the current filter.
          </div>
        )}

        {/* show more */}
        {hasMore && (
          <div style={{ textAlign:'center', marginTop:24 }}>
            <button className="tb" onClick={() => setPage(p => p+1)}
              style={{ padding:'10px 28px', fontSize:12 }}>
              Show more ({visible.length - paginated.length} remaining)
            </button>
          </div>
        )}

      </motion.div>
    </div>
  )
}
