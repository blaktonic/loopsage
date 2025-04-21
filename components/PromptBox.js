import React from 'react'

export default function PromptBox({ analysis }) {
  const prompt = `Dreamy ${analysis.genre} beat at ${analysis.bpm} BPM in ${analysis.key}, with ${analysis.instruments.join(', ')}. Drop starts at ${analysis.drop}. Mood: ${analysis.mood}.`

  return (
    <div className="bg-gray-100 p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Generierter Prompt:</h2>
      <textarea value={prompt} rows={5} className="w-full p-2 rounded border" readOnly />
      <button
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => navigator.clipboard.writeText(prompt)}
      >
        Prompt kopieren
      </button>
    </div>
  )
}
