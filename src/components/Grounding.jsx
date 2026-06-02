import { motion } from 'framer-motion'
import results  from '../../data/results.json'
import findings from '../../data/findings.json'

function RankedBar({ configs, valueKey, label, color, fmt }) {
  const sorted = [...configs].sort((a,b) => b[valueKey] - a[valueKey])
  const max    = Math.max(...sorted.map(c => c[valueKey]))

  return (
    <div>
      <div style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--text-faint)',
        textTransform:'uppercase', letterSpacing:'.12em', marginBottom:16 }}>{label}</div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {sorted.map((cfg, i) => {
          const val = cfg[valueKey]
          const pct = (val / max) * 100
          return (
            <motion.div key={cfg.config}
              initial={{ opacity:0, x:-10 }} whileInView={{ opacity:1, x:0 }}
              transition={{ duration:.35, delay: i*.03 }}
              viewport={{ once:true, margin:'-40px' }}
              style={{ display:'grid', gridTemplateColumns:'1fr 40px', gap:10, alignItems:'center' }}>

              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <span style={{ fontFamily:'var(--fb)', fontSize:12, color:'var(--text)' }}>
                    {cfg.config}
                  </span>
                </div>
                <div style={{ height:7, background:'var(--bg-elevated)', borderRadius:4, overflow:'hidden' }}>
                  <motion.div
                    initial={{ width:0 }}
                    whileInView={{ width:`${pct}%` }}
                    transition={{ duration:.7, delay: i*.04, ease:'easeOut' }}
                    viewport={{ once:true }}
                    style={{ height:'100%', background:color, borderRadius:4 }}
                  />
                </div>
              </div>

              <div style={{ fontFamily:'var(--fm)', fontSize:13, fontWeight:700,
                color:color, textAlign:'right' }}>
                {fmt(val)}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default function Grounding() {
  const cfgs = results.configurations
  const note = findings.behavioural_notes.abstention

  return (
    <div className="sw">
      <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
        transition={{ duration:.5 }} viewport={{ once:true, margin:'-80px' }}>

        <span className="eyebrow">S3 — Grounding &amp; Abstention</span>
        <h2 className="section-title">Behaviour on TriviaQA</h2>
        <p className="section-desc">
          Computed from raw per-question predictions (500 per configuration).
          Abstention is when the model returns "no context provided" rather than an answer.
        </p>

        {/* caveat card */}
        <div style={{
          background:'rgba(242,118,107,.06)', border:'1px solid rgba(242,118,107,.2)',
          borderRadius:10, padding:'14px 18px', marginBottom:36,
          fontFamily:'var(--fm)', fontSize:12, color:'var(--text-muted)', lineHeight:1.7,
          display:'flex', gap:12, alignItems:'flex-start',
        }}>
          <span style={{ color:'var(--coral)', fontSize:16, flexShrink:0 }}>⚠</span>
          <span>
            <strong style={{ color:'var(--text)' }}>Higher abstention ≠ safer.</strong>{' '}
            {note}
          </span>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:40 }}>
          <div className="panel">
            <RankedBar
              configs={cfgs} valueKey="trivia_reject_pct"
              label="Abstention Rate — share of 500 questions answered 'no context provided'"
              color="var(--coral)"
              fmt={v => `${v}%`}
            />
          </div>

          <div className="panel">
            <RankedBar
              configs={cfgs} valueKey="trivia_grounding_pct"
              label="Answer Grounding — share where the gold string appears in the model output"
              color="var(--teal)"
              fmt={v => `${v}%`}
            />
          </div>
        </div>

        {/* behavioural caveat */}
        <div style={{
          marginTop:32, padding:'16px 20px',
          background:'var(--bg-elevated)', borderRadius:10, border:'1px solid var(--border)',
          fontFamily:'var(--fb)', fontSize:13, color:'var(--text-muted)', lineHeight:1.75,
        }}>
          <strong style={{ color:'var(--text)' }}>Note on grounding:</strong>{' '}
          {findings.behavioural_notes.caveat}
        </div>

      </motion.div>
    </div>
  )
}
