import axios from "axios";

export const translateGroq = async (text, sourceLang, targetLang) => {
  const response = await axios.post(
    "https://multi-modal-langauge-translator.onrender.com/translate/groq",
    { text, sourceLang, targetLang }
  );

  return response.data[0]?.translation_text;
};