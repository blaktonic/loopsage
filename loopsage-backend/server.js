const express = require("express")
const formidable = require("formidable")
const fs = require("fs")
const mm = require("music-metadata")
const bpm = require("bpm-detective")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 3001
app.use(cors({ origin: "*" }))

app.post("/analyze", (req, res) => {
  console.log("🔔 Upload erhalten – starte Analyse")

  const form = formidable({ multiples: false })

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "File parsing failed" })

    const file = files.audioFile
    if (!file) return res.status(400).json({ error: "No file uploaded" })

    const filePath = file.filepath

    try {
      const metadata = await mm.parseFile(filePath)
      const buffer = fs.readFileSync(filePath)

      const detectedBPM = bpm(buffer)

      const result = [{
        bpm: detectedBPM || "Unbekannt",
        key: "C (approx)",
        drop_time: "8.0 seconds",
      }]

      console.log("✅ Analyse abgeschlossen:", result)
      res.status(200).json({ data: result })
    } catch (e) {
      console.error("❌ Fehler bei Analyse:", e)
      res.status(500).json({ error: "Analyse fehlgeschlagen" })
    }
  })
})

app.get("/", (req, res) => {
  res.send("LoopSage Analyzer API is running ✅")
})

app.listen(PORT, () => console.log(`🚀 Server läuft auf Port ${PORT}`))
