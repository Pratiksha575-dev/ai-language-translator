import axios from "axios";

export const translateAWSFrontend = async (text, sourceLang, targetLang) => {
  const response = await axios.post(
    "http://192.168.1.201:5000/translate/aws", // your PC IP
    {
      text,
      sourceLang,
      targetLang
    }
  );

  return response.data.translation;
};