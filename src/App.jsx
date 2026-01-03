import React, {useState} from 'react'

const ORGANS = ['Heart','Pancreas','Liver','Blood','Lungs','Kidney']

export default function App(){
  const [organ, setOrgan] = useState(ORGANS[0])
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    if (!file) { setStatus('Please select a file to upload'); return }
    setStatus('Uploading...')
    const fd = new FormData()
    fd.append('organ', organ)
    fd.append('report', file)
    try{
      const res = await fetch('/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Upload failed')
      setStatus(`Uploaded to ${json.organ}: ${json.filename}`)
    }catch(err){ setStatus('Error: ' + err.message) }
  }

  return (
    <div className="app-root">
      <nav className="topbar">
        <div className="container">
          <div className="brand">vito</div>
          <div className="navlinks">
            <a className="nav-item" href="#">search</a>
            <a className="nav-item" href="#">browse</a>
            <a className="contact" href="#">contact us</a>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-card">
            <div className="hero-overlay" />
            <div className="hero-content">
              <small className="eyebrow">CASE STUDY</small>
              <h2>Upload Organ Report — Quick & Secure</h2>
              <p>Choose the organ and upload your report. Files are stored securely and organized per organ type.</p>
            </div>
          </div>
        </section>

        <header>
          <h1>vito</h1>
          <p className="subtitle">Upload Organ Report</p>
        </header>

        <form className="upload-form" onSubmit={handleSubmit}>
          <label htmlFor="organ">Select Organ</label>
          <select id="organ" value={organ} onChange={e => setOrgan(e.target.value)}>
            {ORGANS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>

          <label htmlFor="report">Select Report (pdf/images allowed)</label>
          <input id="report" type="file" onChange={e => setFile(e.target.files && e.target.files[0])} />

          <button type="submit">Upload</button>
        </form>

        <div id="status">{status}</div>
      </main>
    </div>
  )
}
