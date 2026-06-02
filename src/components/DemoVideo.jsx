import { motion } from 'framer-motion'

// ── Paste your YouTube video ID here ──────────────────────────────────────
// Example: for https://youtu.be/dQw4w9WgXcQ  →  YOUTUBE_ID = 'dQw4w9WgXcQ'
const YOUTUBE_ID = '4nkmBaYp6dI'
// ─────────────────────────────────────────────────────────────────────────

export default function DemoVideo() {
  return (
    <div className="sw">
      <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
        transition={{ duration:.5 }} viewport={{ once:true, margin:'-80px' }}>

        <span className="eyebrow">S6 — Demo</span>
        <h2 className="section-title">System Demonstration</h2>
        <p className="section-desc">
          A walkthrough of the CA-RAG pipeline — document ingestion, chunk-level generation,
          and similarity-based post-processing validation.
        </p>

        {/* 16:9 responsive container */}
        <motion.div
          initial={{ opacity:0, scale:.98 }} whileInView={{ opacity:1, scale:1 }}
          transition={{ duration:.5, delay:.1 }} viewport={{ once:true }}
          style={{
            position:'relative', width:'100%', paddingBottom:'56.25%',
            background:'var(--bg-elevated)', borderRadius:'var(--radius)',
            border:'1px solid var(--border)', overflow:'hidden',
          }}>

          {YOUTUBE_ID ? (
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_ID}`}
              title="CA-RAG System Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:'none' }}
            />
          ) : (
            /* placeholder when YOUTUBE_ID is empty */
            <div style={{
              position:'absolute', inset:0, display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', gap:20,
            }}>
              <div style={{
                width:72, height:72, borderRadius:'50%',
                background:'rgba(232,163,61,.12)', border:'2px solid rgba(232,163,61,.25)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <svg viewBox="0 0 24 24" width={28} height={28} fill="none">
                  <polygon points="8,5 19,12 8,19" fill="#E8A33D" />
                </svg>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'var(--fd)', fontSize:18, fontWeight:600, color:'var(--text)', marginBottom:8 }}>
                  Demo video coming soon
                </div>
                <div style={{ fontFamily:'var(--fm)', fontSize:12, color:'var(--text-muted)', lineHeight:1.6 }}>
                  Set{' '}
                  <code style={{ background:'var(--bg-panel)', padding:'2px 7px', borderRadius:4, color:'var(--gold)' }}>
                    YOUTUBE_ID
                  </code>
                  {' '}in{' '}
                  <code style={{ background:'var(--bg-panel)', padding:'2px 7px', borderRadius:4, color:'var(--teal)' }}>
                    src/components/DemoVideo.jsx
                  </code>
                  {' '}line 5
                </div>
              </div>
            </div>
          )}
        </motion.div>

      </motion.div>
    </div>
  )
}
