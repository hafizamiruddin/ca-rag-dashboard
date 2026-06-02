import meta from '../../data/project-meta.json'

export default function Footer() {
  return (
    <footer style={{
      borderTop:'1px solid var(--border)', background:'var(--bg-panel)',
      padding:'60px 28px 40px',
    }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:48, marginBottom:48 }}>

          {/* about */}
          <div>
            <div style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--teal)',
              textTransform:'uppercase', letterSpacing:'.12em', marginBottom:14 }}>About</div>
            <div style={{ fontFamily:'var(--fd)', fontSize:17, fontWeight:700,
              color:'var(--text)', marginBottom:10 }}>CA-RAG Dashboard</div>
            <p style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.75 }}>
              An interactive results dashboard for Project {meta.project_id} —
              a context-aware RAG system for document question answering that
              validates generated answers using embedding similarity rather than
              traditional top-k retrieval. Built as a Final Year Project at IIUM.
            </p>
          </div>

          {/* experiment summary */}
          <div>
            <div style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--gold)',
              textTransform:'uppercase', letterSpacing:'.12em', marginBottom:14 }}>Experiment Summary</div>
            {[
              ['Design',   '2 embeddings × 2 chunking × 3 post-processing = 12 configs'],
              ['Questions','500 TriviaQA + SQuAD per configuration'],
              ['Metric',   'BERTScore (RoBERTa-large): Precision / Recall / F1'],
              ['Generator','Zephyr-7B-Beta (4-bit quantization)'],
              ['Hardware', '1× NVIDIA RTX 4090 (24 GB VRAM)'],
            ].map(([k,v]) => (
              <div key={k} style={{ display:'flex', gap:12, marginBottom:8 }}>
                <span style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--text-faint)',
                  minWidth:80, flexShrink:0, paddingTop:2 }}>{k}</span>
                <span style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.6 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* references */}
          <div>
            <div style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--violet)',
              textTransform:'uppercase', letterSpacing:'.12em', marginBottom:14 }}>Key References</div>
            <ol style={{ paddingLeft:0, listStyle:'none', display:'flex', flexDirection:'column', gap:10 }}>
              {meta.key_references.map((r,i) => (
                <li key={i} style={{ display:'flex', gap:8, fontSize:12, color:'var(--text-muted)', lineHeight:1.65 }}>
                  <span style={{ fontFamily:'var(--fm)', fontSize:10, color:'var(--text-faint)', flexShrink:0, paddingTop:2 }}>[{i+1}]</span>
                  {r}
                </li>
              ))}
            </ol>
          </div>

        </div>

        {/* bottom bar */}
        <div style={{
          borderTop:'1px solid var(--border)', paddingTop:24,
          display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16,
        }}>
          <div style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--text-faint)' }}>
            IIUM · KICT · Innovative Tech Expo Sem 2 25/26
          </div>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            {meta.authors.map(a => (
              <span key={a.matric} style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--text-faint)' }}>
                {a.name} <span style={{ color:'var(--border)' }}>·</span> {a.matric}
              </span>
            ))}
          </div>
          <div style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--text-faint)' }}>
            Supervisor: {meta.supervisor}
          </div>
        </div>
      </div>
    </footer>
  )
}
