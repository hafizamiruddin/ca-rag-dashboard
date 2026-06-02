import { motion } from 'framer-motion'
import findings from '../../data/findings.json'

const DIM_COLOR = {
  'Effect of Post-Processing':    'var(--coral)',
  'Effect of Embedding Model':    'var(--teal)',
  'Cosine Similarity vs Dot Product': 'var(--violet)',
  'Effect of Chunking Strategy':  'var(--gold)',
  'TriviaQA vs SQuAD':            'var(--green)',
}

function EvidenceBox({ ev }) {
  return (
    <div style={{
      background:'var(--bg-elevated)', borderRadius:8, padding:'12px 14px',
      fontFamily:'var(--fm)', fontSize:11, color:'var(--text-muted)',
      lineHeight:1.7, marginTop:14,
    }}>
      <div style={{ color:'var(--text-faint)', textTransform:'uppercase', letterSpacing:'.08em', fontSize:10, marginBottom:6 }}>Evidence</div>
      {Object.entries(ev).map(([k,v]) => (
        <div key={k} style={{ marginBottom:4 }}>
          <span style={{ color:'var(--text)' }}>{k}:{' '}</span>
          {typeof v === 'object' ? (
            Object.entries(v).map(([ek,ev2],i) => (
              <span key={ek}>
                {i>0 && <span style={{ color:'var(--text-faint)' }}> · </span>}
                <span style={{ color:'var(--text-muted)' }}>{ek} </span>
                <span style={{ color:'var(--teal)', fontWeight:700 }}>
                  {typeof ev2==='number' ? ev2.toFixed(4) : ev2}
                </span>
              </span>
            ))
          ) : (
            <span style={{ color:'var(--teal)', fontWeight:700 }}>{v}</span>
          )}
        </div>
      ))}
    </div>
  )
}

export default function Findings() {
  return (
    <div className="sw">
      <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
        transition={{ duration:.5 }} viewport={{ once:true, margin:'-80px' }}>

        <span className="eyebrow">S4 — Key Findings</span>
        <h2 className="section-title">What the experiments show</h2>

        {/* headline conclusions */}
        <div style={{ display:'flex', flexDirection:'column', gap:1, marginBottom:48 }}>
          {findings.headline_conclusions.map((c,i) => (
            <motion.div key={i}
              initial={{ opacity:0, x:-16 }} whileInView={{ opacity:1, x:0 }}
              transition={{ duration:.4, delay:i*.1 }} viewport={{ once:true }}>
              <div style={{
                display:'flex', alignItems:'flex-start', gap:16,
                padding:'22px 24px',
                background: i===0 ? 'rgba(79,209,197,.05)' : 'var(--bg-panel)',
                borderTop: i===0 ? '1px solid rgba(79,209,197,.2)' : '1px solid var(--border)',
                borderLeft: i===0 ? '3px solid var(--teal)' : '3px solid var(--border)',
                borderRight:'1px solid var(--border)',
                borderBottom:'none',
                ...(i===findings.headline_conclusions.length-1
                  ? { borderBottom:'1px solid var(--border)', borderRadius:'0 0 10px 10px' }
                  : {}),
                ...(i===0 ? { borderRadius:'10px 10px 0 0' } : {}),
              }}>
                <span style={{
                  fontFamily:'var(--fm)', fontSize:11, fontWeight:700,
                  color: i===0 ? 'var(--teal)' : 'var(--text-faint)',
                  minWidth:24, paddingTop:2,
                }}>0{i+1}</span>
                <p style={{ fontFamily:'var(--fd)', fontSize:17, fontWeight:600, color:'var(--text)', lineHeight:1.55 }}>
                  {c}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* finding cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:16 }}>
          {findings.findings.map((f,i) => {
            const col = DIM_COLOR[f.dimension] || 'var(--teal)'
            return (
              <motion.div key={f.id}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                transition={{ duration:.45, delay: i*.07 }}
                viewport={{ once:true, margin:'-40px' }}
                style={{
                  background:'var(--bg-panel)', borderRadius:'var(--radius)',
                  border:`1px solid var(--border)`,
                  borderLeft:`4px solid ${col}`,
                  padding:'24px 22px', display:'flex', flexDirection:'column',
                }}>

                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <span className="badge" style={{ background:`${col}18`, color:col, border:`1px solid ${col}30`, fontSize:9 }}>
                    {f.dimension}
                  </span>
                </div>

                <h3 style={{ fontFamily:'var(--fd)', fontSize:17, fontWeight:700,
                  color:'var(--text)', marginBottom:10, lineHeight:1.3 }}>
                  {f.title}
                </h3>

                <p style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.7, marginBottom:10 }}>
                  {f.summary}
                </p>

                <p style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.7, fontStyle:'italic', flex:1 }}>
                  {f.explanation}
                </p>

                <EvidenceBox ev={f.evidence} />

                <div style={{ marginTop:12, textAlign:'right' }}>
                  <span className="badge" style={{ background:'rgba(154,140,255,.1)', color:'var(--violet)', border:'1px solid rgba(154,140,255,.2)', fontSize:9 }}>
                    {f.tag}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* limitations */}
        <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
          transition={{ duration:.4, delay:.2 }} viewport={{ once:true }}
          style={{ marginTop:40, padding:'22px 26px', background:'var(--bg-elevated)',
            border:'1px solid var(--border)', borderRadius:'var(--radius)' }}>
          <div style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--text-faint)',
            textTransform:'uppercase', letterSpacing:'.1em', marginBottom:14 }}>Limitations</div>
          <ul style={{ display:'flex', flexDirection:'column', gap:8, paddingLeft:0, listStyle:'none' }}>
            {findings.limitations.map((l,i) => (
              <li key={i} style={{ display:'flex', gap:12, fontSize:14, color:'var(--text-muted)', lineHeight:1.65 }}>
                <span style={{ color:'var(--text-faint)', flexShrink:0, fontFamily:'var(--fm)', fontSize:11, paddingTop:2 }}>—</span>
                {l}
              </li>
            ))}
          </ul>
        </motion.div>

      </motion.div>
    </div>
  )
}
