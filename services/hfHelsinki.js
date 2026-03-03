import axios from "axios";

export const translateHelsinki = async (text, sourceLang, targetLang) => {
  const response = await axios.post(
    "http://192.168.1.201:5000/translate/helsinki",
    { text, sourceLang, targetLang }
  );

  return response.data[0]?.translation_text;
};