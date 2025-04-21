import React from 'react'

export default function Upload({ setAnalysis }) {
  const handleUpload = (e) => {
    e.preventDefault()
    const mockAnalysis = {
      bpm: 91,
      key: "A minor",
      genre: "Lo-Fi Hip Hop",
      mood: "dreamy, nostalgic",
      instruments: ["Rhodes", "vinyl crackle", "sub bass", "boom bap drums"],
      drop: "00:26"
    }
    setTimeout(() => setAnalysis(mockAnalysis), 1000)
  }

  return (
    <form onSubmit={handleUpload} className="mb-6">
      <input type="file" accept=".mp3,.wav" className="mb-2 block" />
      <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
        Analyse starten
      </button>
    </form>
  )
}
