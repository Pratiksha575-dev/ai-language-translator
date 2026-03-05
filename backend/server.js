import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import FormData from "form-data";
import fs from "fs";
import {transcribeAudio} from "./groqWhisper.js";

dotenv.config();
console.log("AWS REGION:", process.env.AWS_REGION);
const app = express();
app.use(cors());
app.use(express.json());

const HF_TOKEN = process.env.HF_TOKEN;
// Language map for NLLB
const langMap = {
  en: "eng_Latn",
  hi: "hin_Deva",
  mr: "mar_Deva",
  ta: "tam_Taml",
  te: "tel_Telu",
  bn: "ben_Beng",
  ur: "urd_Arab"
};

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
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
      }
    );

    res.json(response.data);

  } catch (error) {
    console.log("HELSINKI ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "Helsinki failed" });
  }
});

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
/* ---------------- GROQ LLAMA ---------------- */
app.post("/translate/groq", async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;
    const langNames = {
  en: "English",
  hi: "Hindi",
  mr: "Marathi",
  ta: "Tamil",
  te: "Telugu",
};
    const prompt = `
You are a professional translation engine.
Translate the following text from ${langNames[sourceLang]} to ${langNames[targetLang]}.


Rules:
- Only output the translated sentence.
- Reframe the sentence to suit the target language semantics if necessary.
- Do not explain.
- Do not add extra words.
- Do not repeat the input.

Text:
${text}
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "user", content: prompt }
        ],
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    const ext = file.originalname.split(".").pop();
    cb(null, uniqueSuffix + "." + ext);
  }
});

const upload = multer({ storage });
app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {

    if (!req.file) {
      console.log("No file received");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Uploaded file info:", req.file);

    const filePath = req.file.path;
    console.log("File path:", filePath);

    const text = await transcribeAudio(filePath);

    fs.unlinkSync(filePath);

    res.json({ text });

  } catch (error) {
    console.log("TRANSCRIBE ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "Transcription failed" });
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});