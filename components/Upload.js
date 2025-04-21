// Neue Upload.js für LoopSage mit echter HuggingFace-Analyse
import React, { useState } from 'react'

export default function Upload({ setAnalysis }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleUpload = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const fileInput = e.target.elements.audioFile
    const file = fileInput.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("data", file)

    try {
  const response = await fetch("https://loopsage-analyzer-sitmc.hf.space/api/predict", {
        method: "POST",
        body: formData
      })

      const result = await response.json()
      const data = result?.data?.[0]

      if (!data || data.error) throw new Error(data?.error || "Keine Daten erhalten")

      const bpm = parseFloat(data.bpm)
      let bpmSmart = `${bpm}`
      if (bpm > 140 && bpm < 160) bpmSmart += ` (evtl. ${Math.round(bpm / 2)} – Double-Time?)`
      else if (bpm >= 160) bpmSmart += ` – könnte korrekt sein (z. B. DnB?)`

      const parsed = {
        bpm,
        bpmSmart,
        key: data.key,
        drop: data.drop_time
      }
      setAnalysis(parsed)
    } catch (err) {
      setError(err.message || "Fehler bei der Analyse")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpload} className="mb-6">
      <input type="file" name="audioFile" accept=".mp3,.wav" className="mb-2 block" />
      <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
        {loading ? "Analysiere..." : "Analyse starten"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  )
}
