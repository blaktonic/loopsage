// pages/api/analyze.js – Proxy zur HuggingFace Analyse API
const formidable = require('formidable');
const fs = require('fs');
const FormData = require('form-data');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'File parsing failed' });

    const file = files.audioFile;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const formData = new FormData();
    formData.append("data", fs.createReadStream(file.filepath), file.originalFilename);

    try {
      const hfRes = await fetch("https://loopsage-analyzer-sitmc.hf.space/api/predict", {
        method: "POST",
        body: formData,
        headers: formData.getHeaders(),
      });

      const text = await hfRes.text();
      try {
        const result = JSON.parse(text);
        res.status(200).json(result);
      } catch (jsonErr) {
        console.error("HF antwortete mit:", text);
        res.status(500).json({ error: "HF response was not valid JSON", raw: text });
      }
    } catch (e) {
      res.status(500).json({ error: 'Fetch to HuggingFace failed' });
    }
  });
}
