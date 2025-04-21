import Head from 'next/head'
import { useState } from 'react'
import Upload from '../components/Upload'
import PromptBox from '../components/PromptBox'

export default function Home() {
  const [analysis, setAnalysis] = useState(null)

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans">
      <Head>
        <title>LoopSage</title>
      </Head>
      <h1 className="text-3xl font-bold mb-6">LoopSage – Instrumental2Prompt</h1>
      <Upload setAnalysis={setAnalysis} />
      {analysis && <PromptBox analysis={analysis} />}
    </div>
  )
}
