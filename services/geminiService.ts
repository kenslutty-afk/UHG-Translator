
import { GoogleGenAI, Type } from "@google/genai";
import { Language, TranslationResponse } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = "gemini-2.5-flash";

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    sourceLanguage: {
      type: Type.STRING,
      description: 'The detected source language of the input text.',
      enum: Object.values(Language),
    },
    japanese: {
      type: Type.STRING,
      description: 'The translated text in Japanese. If the source is Japanese, return the original text.',
    },
    traditionalChinese: {
      type: Type.STRING,
      description: 'The translated text in Traditional Chinese. If the source is Traditional Chinese, return the original text.',
    },
    english: {
      type: Type.STRING,
      description: 'The translated text in English. If the source is English, return the original text.',
    },
    korean: {
      type: Type.STRING,
      description: 'The translated text in Korean. If the source is Korean, return the original text.',
    },
  },
  required: ['sourceLanguage', 'japanese', 'traditionalChinese', 'english', 'korean'],
};

export const detectAndTranslate = async (text: string): Promise<TranslationResponse> => {
  const prompt = `
    You are an expert polyglot translation engine. Your task is to first detect the language of the provided text from the following options: Japanese, Traditional Chinese, English, Korean.
    Then, translate the text into the other three languages from that list.

    Return a JSON object that strictly adheres to the provided schema. The JSON object must contain the detected source language and the text for all four languages. For the detected source language, simply return the original, untranslated text under its corresponding language key.

    Text to process: "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const jsonString = response.text.trim();
    const parsedJson = JSON.parse(jsonString);
    
    // Validate the response structure
    if (!parsedJson.sourceLanguage || typeof parsedJson.japanese !== 'string' || typeof parsedJson.traditionalChinese !== 'string' || typeof parsedJson.english !== 'string' || typeof parsedJson.korean !== 'string') {
        throw new Error("Invalid response format from API");
    }

    return parsedJson as TranslationResponse;

  } catch (error) {
    console.error("Error in Gemini API call:", error);
    throw new Error("Failed to communicate with the translation service.");
  }
};
