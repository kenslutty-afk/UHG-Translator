
export enum Language {
  JAPANESE = 'Japanese',
  TRADITIONAL_CHINESE = 'Traditional Chinese',
  ENGLISH = 'English',
  KOREAN = 'Korean',
}

export interface TranslationResponse {
  sourceLanguage: Language;
  japanese: string;
  traditionalChinese: string;
  english: string;
  korean: string;
}
