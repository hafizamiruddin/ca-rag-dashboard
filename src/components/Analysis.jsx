import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis, Legend,
} from 'recharts'
import dim     from '../../data/dimension-analysis.json'
import results from '../../data/results.json'

const AXIS_STYLE = {
  tick:{ fill:'#8a95a8', fontFamily:"'JetBrains Mono',monospace", fontSize:11 },
  axisLine:{ stroke:'#262c3a' }, tickLine:{ stroke:'#262c3a' },
}
const TOOLTIP_STYLE = {
  contentStyle:{ background:'#161b27', border:'1px solid #262c3a', borderRadius:8,
    fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:'#ECE7DC' },
  labelStyle:{ color:'#8a95a8', marginBottom:4 },
  itemStyle:{ color:'#ECE7DC' },
  formatter: v => [typeof v==='number'?v.toFixed(4):v,'Mean F1'],
}

function heatColor(v, lo=0.5823, hi=0.802) {
  const t = Math.max(0, Math.min(1, (v-lo)/(hi-lo)))
  const r = Math.round(242 - 119*t), g = Math.round(118 + 98*t), b = Math.round(107 + 36*t)
  return `rgb(${r},${g},${b})`
}

function MiniBar({ title, data, ds }) {
  const bars = data.map(d => ({ name:d.name, value: ds==='TriviaQA' ? d.trivia : d.squad }))
  return (
    <div className="panel">
      <div style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--text-muted)',
        textTransform:'uppercase', letterSpacing:'.1em', marginBottom:12 }}>{title}</div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={bars} margin={{ top:4, right:4, bottom:0, left:-20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262c3a" />
          <XAxis dataKey="name" {...AXIS_STYLE} />
          <YAxis domain={[0.5,0.85]} {...AXIS_STYLE} tickFormatter={v=>v.toFixed(2)} />
          <Tooltip {...TOOLTIP_STYLE} />
          <Bar dataKey="value" radius={[4,4,0,0]} maxBarSize={60}>
            {bars.map((b,i) => (
              <Cell key={i} fill={['#4FD1C5','#9A8CFF','#E8A33D','#7BD88F','#F2766B'][i%5]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const ScatterTip = ({ active, payload }) => {
  if (!active || !payload?.[0]) return null
  const d = payload[0].payload
  return (
    <div style={{ background:'#161b27', border:'1px solid #262c3a', borderRadius:8,
      padding:'10px 14px', fontFamily:"'JetBrains Mono',monospace", fontSize:12 }}>
      <div style={{ color:'#ECE7DC', fontWeight:600, marginBottom:4 }}>{d.config}</div>
      <div style={{ color:'#8a95a8' }}>Prec <span style={{ color:'#ECE7DC' }}>{d.prec?.toFixed(4)}</span></div>
      <div style={{ color:'#8a95a8' }}>Rec  <span style={{ color:'#ECE7DC' }}>{d.rec?.toFixed(4)}</span></div>
      <div style={{ color:'#8a95a8' }}>F1   <span style={{ color:'#ECE7DC' }}>{d.f1?.toFixed(4)}</span></div>
    </div>
  )
}

export default function Analysis() {
  const [ds1, setDs1] = useState('TriviaQA')
  const [ds2, setDs2] = useState('TriviaQA')

  const embData = [
    { name:'Contriever', trivia: dim.by_embedding.TriviaQA.Contriever, squad: dim.by_embedding.SQuAD.Contriever },
    { name:'MiniLM',     trivia: dim.by_embedding.TriviaQA.MiniLM,     squad: dim.by_embedding.SQuAD.MiniLM     },
  ]
  const chkData = [
    { name:'Semantic', trivia: dim.by_chunking.TriviaQA.Semantic, squad: dim.by_chunking.SQuAD.Semantic },
    { name:'Fixed',    trivia: dim.by_chunking.TriviaQA.Fixed,    squad: dim.by_chunking.SQuAD.Fixed    },
  ]
  const ppData = [
    { name:'No PP',  trivia: dim.by_postprocessing.TriviaQA['No PP'],      squad: dim.by_postprocessing.SQuAD['No PP']      },
    { name:'Dot',    trivia: dim.by_postprocessing.TriviaQA['Dot Product'], squad: dim.by_postprocessing.SQuAD['Dot Product'] },
    { name:'Cosine', trivia: dim.by_postprocessing.TriviaQA['Cosine'],      squad: dim.by_postprocessing.SQuAD['Cosine']      },
  ]

  // Interaction table
  const ixTable = dim.embedding_x_pp_TriviaQA
  const ixRows  = Object.keys(ixTable)
  const ixCols  = ['No PP','Dot Product','Cosine']

  // Scatter data
  const scatterData = (emb) => results.configurations
    .filter(c => c.embedding === emb)
    .map(c => {
      const src = ds2==='TriviaQA' ? c.triviaqa : c.squad
      return { prec:src.prec, rec:src.rec, f1:src.f1, config:c.config }
    })

  return (
    <div className="sw" style={{ background:'linear-gradient(to bottom, transparent, rgba(255,255,255,.01), transparent)' }}>
      <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
        transition={{ duration:.5 }} viewport={{ once:true, margin:'-80px' }}>

        <span className="eyebrow">S2 — Comparative Analysis</span>
        <h2 className="section-title">Where the score comes from</h2>
        <p className="section-desc">
          Mean BERTScore F1 broken down by embedding model, chunking strategy, and
          post-processing method. The embedding model is the dominant factor.
        </p>

        {/* dataset toggle for mini charts */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
          <span style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--text-faint)' }}>Dataset</span>
          <div className="tg">
            {['TriviaQA','SQuAD'].map(d => (
              <button key={d} className={`tb${ds1===d?' on':''}`} onClick={()=>setDs1(d)}>{d}</button>
            ))}
          </div>
        </div>

        {/* 3 mini bar charts */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:16, marginBottom:40 }}>
          <MiniBar title="By Embedding Model"   data={embData} ds={ds1} />
          <MiniBar title="By Chunking Strategy" data={chkData} ds={ds1} />
          <MiniBar title="By Post-Processing"   data={ppData}  ds={ds1} />
        </div>

        {/* Interaction heatmap */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          transition={{ duration:.5, delay:.1 }} viewport={{ once:true }}>
          <div className="panel" style={{ marginBottom:40, border:'1px solid rgba(232,163,61,.2)', position:'relative', overflow:'hidden' }}>
            <div style={{
              position:'absolute', top:0, left:0, right:0, height:3,
              background:'linear-gradient(90deg, var(--gold), var(--coral), transparent)',
            }} />
            <div style={{ display:'flex', alignItems:'flex-start', gap:16, flexWrap:'wrap', justifyContent:'space-between', marginBottom:20 }}>
              <div>
                <div style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--gold)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:6 }}>
                  Key Interaction · TriviaQA
                </div>
                <div style={{ fontFamily:'var(--fd)', fontSize:18, fontWeight:700, color:'var(--text)' }}>
                  Embedding × Post-Processing
                </div>
              </div>
              <div style={{ fontFamily:'var(--fb)', fontSize:13, color:'var(--text-muted)', maxWidth:340, lineHeight:1.65 }}>
                MiniLM Dot&nbsp;==&nbsp;MiniLM Cosine (both&nbsp;<strong style={{ color:'var(--coral)' }}>0.5823</strong>).
                Contriever Dot (<strong style={{ color:'var(--green)' }}>0.7933</strong>) ≫ Contriever Cosine
                (<strong style={{ color:'var(--gold)' }}>0.7001</strong>).
                The embedding model — not the similarity measure — is what matters.
              </div>
            </div>

            <div style={{ overflowX:'auto' }}>
              <table style={{ borderCollapse:'collapse', minWidth:420 }}>
                <thead>
                  <tr>
                    <th style={{ fontFamily:'var(--fm)', fontSize:10, color:'var(--text-faint)', textAlign:'left',
                      padding:'6px 14px 6px 0', textTransform:'uppercase', letterSpacing:'.1em' }}>Embedding</th>
                    {ixCols.map(c => (
                      <th key={c} style={{ fontFamily:'var(--fm)', fontSize:10, color:'var(--text-muted)',
                        padding:'6px 18px', textAlign:'center', textTransform:'uppercase', letterSpacing:'.08em' }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ixRows.map(row => (
                    <tr key={row}>
                      <td style={{ fontFamily:'var(--fm)', fontSize:12, fontWeight:600,
                        color:'var(--text)', padding:'10px 14px 10px 0' }}>{row}</td>
                      {ixCols.map(col => {
                        const v = ixTable[row][col]
                        const bg = heatColor(v)
                        return (
                          <td key={col} style={{
                            textAlign:'center', padding:'8px 18px',
                            fontFamily:'var(--fm)', fontSize:16, fontWeight:700,
                            color: '#0c0e13', background: bg, borderRadius:8,
                          }}>
                            {v.toFixed(4)}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* P/R Scatter */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          transition={{ duration:.5, delay:.15 }} viewport={{ once:true }}>
          <div className="panel">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:20 }}>
              <div>
                <div style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:4 }}>
                  Precision vs Recall · point size ∝ F1
                </div>
                <div style={{ fontFamily:'var(--fd)', fontSize:17, fontWeight:700, color:'var(--text)' }}>Scatter: P/R Tradeoff</div>
              </div>
              <div className="tg">
                {['TriviaQA','SQuAD'].map(d => (
                  <button key={d} className={`tb${ds2===d?' on':''}`} onClick={()=>setDs2(d)}>{d}</button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={360}>
              <ScatterChart margin={{ top:10, right:40, bottom:20, left:10 }}>
                <CartesianGrid stroke="#262c3a" strokeDasharray="3 3" />
                <XAxis type="number" dataKey="prec" name="Precision"
                  domain={ds2==='TriviaQA'?[0.5,0.82]:[0.55,0.85]}
                  {...AXIS_STYLE} tickFormatter={v=>v.toFixed(2)}
                  label={{ value:'Precision', position:'insideBottom', offset:-12, fill:'#8a95a8', fontFamily:"'JetBrains Mono',monospace", fontSize:11 }}
                />
                <YAxis type="number" dataKey="rec" name="Recall"
                  domain={ds2==='TriviaQA'?[0.54,0.84]:[0.6,0.9]}
                  {...AXIS_STYLE} tickFormatter={v=>v.toFixed(2)}
                  label={{ value:'Recall', angle:-90, position:'insideLeft', offset:14, fill:'#8a95a8', fontFamily:"'JetBrains Mono',monospace", fontSize:11 }}
                />
                <ZAxis type="number" dataKey="f1" range={[60, 360]} />
                <Tooltip cursor={{ strokeDasharray:'3 3', stroke:'#262c3a' }} content={<ScatterTip />} />
                <Legend wrapperStyle={{ paddingTop:12 }} />
                <Scatter name="Contriever" data={scatterData('CONTRIEVER')} fill="#4FD1C5" fillOpacity={0.85} />
                <Scatter name="MiniLM"     data={scatterData('MINILM')}     fill="#9A8CFF" fillOpacity={0.85} />
              </ScatterChart>
            </ResponsiveContainer>
            <p style={{ fontFamily:'var(--fm)', fontSize:10, color:'var(--text-faint)', textAlign:'center', marginTop:8, letterSpacing:'.05em' }}>
              Up-and-right is better · hover a point for details
            </p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  )
}
