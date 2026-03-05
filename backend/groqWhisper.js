import axios from "axios";
import fs from "fs";
import FormData from "form-data";

export const transcribeAudio = async (filePath) => {
  try {
    const form = new FormData();

    form.append("file", fs.createReadStream(filePath));
    form.append("model", "whisper-large-v3-turbo");
    form.append("response_format", "json");
    const response = await axios.post(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    return response.data.text;

  } catch (error) {
    console.log("GROQ WHISPER ERROR:", error.response?.data || error.message);
    throw error;
  }
};