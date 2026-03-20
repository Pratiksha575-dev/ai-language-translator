import { translateHelsinki } from "./hfHelsinki";
import {translateGoogle} from "./googleTranslate";
import { translateGroq } from "./hfGroq";

export const translateParallel = async (text, sourceLang, targetLang) => {

  const apis = [
    { name: "Helsinki", fn: translateHelsinki },
    //{ name: "AWS", fn: translateAWSFrontend },
    { name: "Google", fn: translateGoogle },
    { name: "Groq-LLaMA", fn: translateGroq }
  ];

  const promises = apis.map(async (api) => {
    const start = Date.now();
    try {
      const result = await api.fn(text, sourceLang, targetLang);
      const time = Date.now() - start;

      return {
        name: api.name,
        text: result,
        time,
        success: true
      };
    } catch {
      return {
        name: api.name,
        text: null,
        time: null,
        success: false
      };
    }
  });

  return await Promise.all(promises);
};

export const translateRealtime = async (text, sourceLang, targetLang) => {

  const start = Date.now();

  try {

    const result = await translateGoogle(text, sourceLang, targetLang);

    return [{
      name: "Google",
      text: result,
      time: Date.now() - start,
      success: true
    }];

  } catch {

    return [{
      name: "Google",
      text: null,
      time: null,
      success: false
    }];

  }

};