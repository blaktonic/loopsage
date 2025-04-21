// server.js – Express Upload Proxy für HuggingFace
const express = require("express")
const formidable = require("formidable")
const fs = require("fs")
const FormData = require("form-data")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 3001
app.use(cors())

app.post("/analyze", (req, res) => {
  const form = formidable({ multiples: false, maxFileSize: 100 * 1024 * 1024 })

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "File parsing failed" })

    const file = files.audioFile
    if (!file) return res.status(400).json({ error: "No file uploaded" })

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
        res.status(200).json(result)
      } catch (jsonErr) {
        res.status(500).json({ error: "HF returned invalid JSON", raw: text })
      }
    } catch (e) {
      res.status(500).json({ error: "Fetch to HuggingFace failed" })
    }
  })
})

app.get("/", (req, res) => {
  res.send("LoopSage Analyzer API is running ✅")
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
