// server.js – Express Upload Proxy für HuggingFace
const express = require("express")
const formidable = require("formidable")
const fs = require("fs")
const FormData = require("form-data")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 3001

// CORS für alle Ursprünge erlauben (z. B. von Vercel)
app.use(cors({ origin: "*" }))

app.post("/analyze", (req, res) => {
  console.log("🔔 POST /analyze aufgerufen")

  const form = formidable({ multiples: false, maxFileSize: 100 * 1024 * 1024 })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("❌ File parsing failed:", err)
      return res.status(500).json({ error: "File parsing failed" })
    }

    const file = files.audioFile
    if (!file) {
      console.warn("⚠️ No file uploaded")
      return res.status(400).json({ error: "No file uploaded" })
    }

    const formData = new FormData()
    formData.append("data", fs.createReadStream(file.filepath), file.originalFilename)

    try {
      const hfRes = await fetch("https://loopsage-analyzer-sitmc.hf.space/api/predict", {
        method: "POST",
        body: formData,
        headers: formData.getHeaders(),
      })
      const text = await hfRes.text()

      try {
        const result = JSON.parse(text)
        console.log("✅ Ergebnis von HF:", result)
        res.status(200).json(result)
      } catch (jsonErr) {
        console.error("❌ JSON parse error:", text)
        res.status(500).json({ error: "HF returned invalid JSON", raw: text })
      }
    } catch (e) {
      console.error("❌ Fetch to HuggingFace failed:", e)
      res.status(500).json({ error: "Fetch to HuggingFace failed" })
    }
  })
})

app.get("/", (req, res) => {
  res.send("LoopSage Analyzer API is running ✅")
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
