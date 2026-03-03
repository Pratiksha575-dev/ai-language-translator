import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";

const client = new TranslateClient({
  region: process.env.AWS_REGION,
});

export const translateAWS = async (text, sourceLang, targetLang) => {
  const command = new TranslateTextCommand({
    Text: text,
    SourceLanguageCode: sourceLang,
    TargetLanguageCode: targetLang,
  });

  const response = await client.send(command);
  return response.TranslatedText;
};