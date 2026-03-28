import axios from "axios";

export const translateGoogle = async (text, sourceLang, targetLang) => {
  const response = await axios.post(
    "https://multi-modal-langauge-translator.onrender.com/translate/google",
    {
      text,
      sourceLang,
      targetLang
    }
  );

  return response.data.translation;
};