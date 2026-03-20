import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import { transcribeAudio } from "./groqWhisper.js";
import Tesseract from "tesseract.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ---------------- MULTER (ONLY ONCE) ---------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    const ext = file.originalname.split(".").pop();
    cb(null, uniqueSuffix + "." + ext);
  }
});

const upload = multer({ storage });

/* ---------------- OCR API ---------------- */
app.post("/ocr", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imagePath = req.file.path;

    const result = await Tesseract.recognize(imagePath, "eng");

    const extractedText = result.data.text;

    fs.unlinkSync(imagePath); // ✅ cleanup

    res.json({ text: extractedText });

  } catch (err) {
    console.log("OCR ERROR:", err);
    res.status(500).json({ error: "OCR failed" });
  }
});

/* ---------------- HELSINKI ---------------- */
app.post("/translate/helsinki", async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;

    const modelName = `Helsinki-NLP/opus-mt-${sourceLang}-${targetLang}`;

    const response = await axios.post(
      `https://router.huggingface.co/hf-inference/models/${modelName}`,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.log("HELSINKI ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "Helsinki failed" });
  }
});

/* ---------------- GOOGLE ---------------- */
app.post("/translate/google", async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;

    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_API_KEY}`,
      {
        q: text,
        source: sourceLang,
        target: targetLang,
        format: "text"
      }
    );

    const translated = response.data.data.translations[0].translatedText;

    res.json({ translation: translated });

  } catch (error) {
    console.log("GOOGLE ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "Google failed" });
  }
});

/* ---------------- GROQ ---------------- */
app.post("/translate/groq", async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;

    const langNames = {
      en: "English",
      hi: "Hindi",
      mr: "Marathi",
      ta: "Tamil",
      te: "Telugu"
    };

    const prompt = `
Translate from ${langNames[sourceLang]} to ${langNames[targetLang]}.

Text:
${text}
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const translated = response.data.choices[0].message.content;

    res.json([{ translation_text: translated }]);

  } catch (error) {
    console.log("GROQ ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "Groq failed" });
  }
});

/* ---------------- AUDIO TRANSCRIBE ---------------- */
app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    const text = await transcribeAudio(filePath);

    fs.unlinkSync(filePath); // ✅ cleanup

    res.json({ text });

  } catch (error) {
    console.log("TRANSCRIBE ERROR:", error.message);
    res.status(500).json({
      error: "Transcription failed",
      errorDetails: error.message
    });
  }
});

/* ---------------- START SERVER ---------------- */
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});