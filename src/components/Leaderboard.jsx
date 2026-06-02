import { useState } from 'react'
import { motion } from 'framer-motion'
import results from '../../data/results.json'

const DATASETS = ['TriviaQA', 'SQuAD']
const METRICS  = ['F1', 'Precision', 'Recall']

function getScore(cfg, ds, metric) {
  const src = ds === 'TriviaQA' ? cfg.triviaqa : cfg.squad
  return metric === 'F1' ? src.f1 : metric === 'Precision' ? src.prec : src.rec
}

function tierColor(s) {
  if (s >= .80) return '#7BD88F'
  if (s >= .78) return '#4FD1C5'
  if (s >= .70) return '#E8A33D'
  if (s >= .60) return '#F5A623'
  return '#F2766B'
}

const EMB_COLOR = { CONTRIEVER:'var(--teal)', MINILM:'var(--violet)' }
const PP_COLOR  = { None:'var(--green)', dot:'var(--gold)', cosine:'var(--coral)' }

const MIN_SCALE = 0.50, MAX_SCALE = 0.85

export default function Leaderboard() {
  const [ds, setDs]   = useState('TriviaQA')
  const [met, setMet] = useState('F1')

  const sorted = [...results.configurations].sort(
    (a,b) => getScore(b,ds,met) - getScore(a,ds,met)
  )

  return (
    <div className="sw">
      <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
        transition={{ duration:.5 }} viewport={{ once:true, margin:'-80px' }}>

        <span className="eyebrow">S1 — Performance</span>
        <h2 className="section-title">Leaderboard</h2>
        <p className="section-desc">
          All 12 configurations ranked by BERTScore. Toggle dataset and metric to explore
          how rankings shift across evaluation conditions.
        </p>

        <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginBottom:32 }}>
          <div>
            <div style={{ fontFamily:'var(--fm)', fontSize:10, color:'var(--text-faint)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:6 }}>Dataset</div>
            <div className="tg">
              {DATASETS.map(d => (
                <button key={d} className={`tb${ds===d?' on':''}`} onClick={() => setDs(d)}>{d}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily:'var(--fm)', fontSize:10, color:'var(--text-faint)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:6 }}>Metric</div>
            <div className="tg">
              {METRICS.map(m => (
                <button key={m} className={`tb${met===m?' on':''}`} onClick={() => setMet(m)}>{m}</button>
              ))}
            </div>
          </div>
        </div>

        {/* scale legend */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6, padding:'0 0 0 88px' }}>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            {[
              ['≥ 0.80', '#7BD88F'], ['≥ 0.78', '#4FD1C5'], ['≥ 0.70', '#E8A33D'],
              ['≥ 0.60', '#F5A623'], ['< 0.60',  '#F2766B'],
            ].map(([lbl, col]) => (
              <div key={lbl} style={{ display:'flex', alignItems:'center', gap:5,
                fontFamily:'var(--fm)', fontSize:10, color:'var(--text-muted)' }}>
                <div style={{ width:8, height:8, borderRadius:2, background:col }} />
                {lbl}
              </div>
            ))}
          </div>
          <div style={{ fontFamily:'var(--fm)', fontSize:10, color:'var(--text-faint)' }}>
            scale {MIN_SCALE.toFixed(2)} – {MAX_SCALE.toFixed(2)}
          </div>
        </div>

        {/* rows */}
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {sorted.map((cfg, i) => {
            const score = getScore(cfg, ds, met)
            const pct   = ((score - MIN_SCALE) / (MAX_SCALE - MIN_SCALE)) * 100
            const col   = tierColor(score)
            const isTop = i === 0

            return (
              <motion.div key={cfg.config}
                initial={{ opacity:0, x:-12 }}
                whileInView={{ opacity:1, x:0 }}
                transition={{ duration:.4, delay: i*.03 }}
                viewport={{ once:true, margin:'-40px' }}
                style={{
                  background: isTop ? 'rgba(123,216,143,.04)' : 'var(--bg-panel)',
                  border: `1px solid ${isTop ? 'rgba(123,216,143,.2)' : 'var(--border)'}`,
                  borderRadius:10, padding:'14px 16px',
                  display:'grid',
                  gridTemplateColumns:'40px 1fr auto',
                  gap:12, alignItems:'center',
                }}>

                {/* rank */}
                <div style={{
                  fontFamily:'var(--fm)', fontSize:12, fontWeight:700,
                  color: isTop ? 'var(--green)' : 'var(--text-faint)',
                  textAlign:'center',
                }}>
                  #{i+1}
                </div>

                {/* name + tags + bar */}
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:8 }}>
                    <span style={{ fontFamily:'var(--fb)', fontSize:14, fontWeight:600, color:'var(--text)' }}>
                      {cfg.config}
                    </span>
                    {isTop && (
                      <span className="badge" style={{ background:'rgba(123,216,143,.15)', color:'var(--green)', border:'1px solid rgba(123,216,143,.3)' }}>
                        ★ Best
                      </span>
                    )}
                    <span className="badge" style={{ background:`${EMB_COLOR[cfg.embedding]}18`, color:EMB_COLOR[cfg.embedding], border:`1px solid ${EMB_COLOR[cfg.embedding]}30` }}>
                      {cfg.embeddingLabel}
                    </span>
                    <span className="badge" style={{ background:'rgba(232,163,61,.1)', color:'var(--gold)', border:'1px solid rgba(232,163,61,.25)' }}>
                      {cfg.chunking}
                    </span>
                    <span className="badge" style={{ background:`${PP_COLOR[cfg.pp]}18`, color:PP_COLOR[cfg.pp], border:`1px solid ${PP_COLOR[cfg.pp]}30` }}>
                      {cfg.ppLabel}
                    </span>
                  </div>

                  {/* bar track */}
                  <div style={{ height:8, background:'var(--bg-elevated)', borderRadius:4, overflow:'hidden' }}>
                    <motion.div
                      initial={{ width:0 }}
                      whileInView={{ width:`${pct}%` }}
                      transition={{ duration:.8, delay: i*.04, ease:'easeOut' }}
                      viewport={{ once:true }}
                      style={{ height:'100%', borderRadius:4, background:col }}
                    />
                  </div>
                </div>

                {/* score */}
                <div style={{
                  fontFamily:'var(--fm)', fontSize:18, fontWeight:700,
                  color: col, minWidth:64, textAlign:'right',
                }}>
                  {score.toFixed(4)}
                </div>
              </motion.div>
            )
          })}
        </div>

      </motion.div>
    </div>
  )
}
