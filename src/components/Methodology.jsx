import { motion } from 'framer-motion'
import meth     from '../../data/methodology.json'
import findings from '../../data/findings.json'

const PHASE_COLORS = ['var(--teal)', 'var(--gold)', 'var(--violet)']

export default function Methodology() {
  return (
    <div className="sw">
      <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
        transition={{ duration:.5 }} viewport={{ once:true, margin:'-80px' }}>

        <span className="eyebrow">S7 — Methodology</span>
        <h2 className="section-title">The CA-RAG Pipeline</h2>
        <p className="section-desc">{meth.overview}</p>

        {/* phase cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:4, marginBottom:48 }}>
          {meth.phases.map((phase, pi) => {
            const col = PHASE_COLORS[pi]
            return (
              <motion.div key={phase.phase}
                initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }}
                transition={{ duration:.45, delay: pi*.1 }}
                viewport={{ once:true, margin:'-40px' }}>

                {/* connector arrow */}
                {pi > 0 && (
                  <div style={{ display:'flex', justifyContent:'center', height:28, alignItems:'center' }}>
                    <svg viewBox="0 0 24 24" width={20} height={20} fill="none">
                      <path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke={PHASE_COLORS[pi]} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}

                <div style={{
                  background:'var(--bg-panel)', border:`1px solid var(--border)`,
                  borderLeft:`4px solid ${col}`, borderRadius:12, padding:'24px 26px',
                  position:'relative', overflow:'hidden',
                }}>
                  <div style={{
                    position:'absolute', top:0, right:0,
                    fontFamily:'var(--fm)', fontSize:80, fontWeight:900, lineHeight:1,
                    color:`${col}08`, pointerEvents:'none', userSelect:'none',
                    letterSpacing:-4, paddingRight:12,
                  }}>0{phase.phase}</div>

                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                    <div style={{
                      fontFamily:'var(--fm)', fontSize:10, fontWeight:700,
                      background:`${col}18`, color:col, border:`1px solid ${col}30`,
                      padding:'3px 10px', borderRadius:5,
                      textTransform:'uppercase', letterSpacing:'.1em',
                    }}>
                      Phase {phase.phase}
                    </div>
                    <h3 style={{ fontFamily:'var(--fd)', fontSize:20, fontWeight:700, color:'var(--text)' }}>
                      {phase.name}
                    </h3>
                  </div>

                  <p style={{ fontSize:14, color:'var(--teal)', marginBottom:14, fontWeight:500 }}>
                    Goal: {phase.goal}
                  </p>

                  <ul style={{ listStyle:'none', paddingLeft:0, display:'flex', flexDirection:'column', gap:8 }}>
                    {phase.steps.map((s,si) => (
                      <li key={si} style={{ display:'flex', gap:12, fontSize:14, color:'var(--text-muted)', lineHeight:1.65 }}>
                        <span style={{ fontFamily:'var(--fm)', fontSize:10, color:col,
                          paddingTop:4, flexShrink:0, fontWeight:700 }}>{String(si+1).padStart(2,'0')}</span>
                        {s}
                      </li>
                    ))}
                  </ul>

                  {/* chunking methods (phase 1) */}
                  {phase.chunking_methods && (
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:16 }}>
                      {phase.chunking_methods.map(m => (
                        <div key={m.name} style={{
                          background:'var(--bg-elevated)', borderRadius:8,
                          border:'1px solid var(--border)', padding:'14px 16px',
                        }}>
                          <div style={{ fontFamily:'var(--fm)', fontSize:11, fontWeight:600,
                            color:'var(--text)', marginBottom:6 }}>{m.name}</div>
                          <div style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.65 }}>{m.detail}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* post-processing rationale (phase 3) */}
                  {phase.rationale && (
                    <div style={{
                      marginTop:16, padding:'12px 14px',
                      background:'rgba(154,140,255,.06)', borderRadius:8,
                      border:'1px solid rgba(154,140,255,.15)',
                      fontFamily:'var(--fb)', fontSize:13, color:'var(--text-muted)', lineHeight:1.7,
                    }}>
                      <span style={{ color:'var(--violet)', fontWeight:600 }}>Rationale: </span>
                      {phase.rationale}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* evaluation */}
        <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
          transition={{ duration:.4, delay:.1 }} viewport={{ once:true }}
          className="panel" style={{ marginBottom:40, borderColor:'rgba(232,163,61,.2)' }}>
          <div style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--gold)',
            textTransform:'uppercase', letterSpacing:'.1em', marginBottom:10 }}>Evaluation Metric</div>
          <p style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.75 }}>{meth.evaluation}</p>
        </motion.div>

        {/* future work */}
        <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
          transition={{ duration:.4, delay:.15 }} viewport={{ once:true }}>
          <div style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--text-faint)',
            textTransform:'uppercase', letterSpacing:'.12em', marginBottom:14 }}>Future Work</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {findings.next_steps.map((s,i) => (
              <div key={i} style={{
                display:'flex', gap:12, alignItems:'flex-start',
                padding:'12px 16px', background:'var(--bg-panel)',
                borderRadius:8, border:'1px solid var(--border)',
                fontSize:14, color:'var(--text-muted)', lineHeight:1.65,
              }}>
                <span style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--teal)',
                  flexShrink:0, paddingTop:2, fontWeight:700 }}>→</span>
                {s}
              </div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  )
}
