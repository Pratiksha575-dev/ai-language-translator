import axios from "axios";

export const translateGoogle = async (text, sourceLang, targetLang) => {
  const response = await axios.post(
    "http://192.168.1.201:5000/translate/google",
    {
      text,
      sourceLang,
      targetLang
    }
  );

  return response.data.translation;
};