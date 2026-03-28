import axios from "axios";

export const translateHelsinki = async (text, sourceLang, targetLang) => {
  const response = await axios.post(
    "https://multi-modal-langauge-translator.onrender.com/translate/helsinki",
    { text, sourceLang, targetLang }
  );

  return response.data[0]?.translation_text;
};