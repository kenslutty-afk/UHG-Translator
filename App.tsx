
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { detectAndTranslate } from './services/geminiService';
import { Language, TranslationResponse } from './types';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const debounceTimeout = useRef<number | null>(null);

  const performTranslation = useCallback(async (text: string) => {
    if (!text.trim()) {
      setOutputText('');
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await detectAndTranslate(text);
      const targetLanguages = Object.values(Language).filter(l => l !== response.sourceLanguage);
      const newTranslations = targetLanguages.map(lang => {
          const key = lang === Language.TRADITIONAL_CHINESE ? 'traditionalChinese' : lang.toLowerCase() as keyof TranslationResponse;
          return response[key] as string;
      });
      setOutputText(newTranslations.join('\n\n'));

    } catch (err) {
      console.error(err);
      setError('Failed to get translation. Please check your API key and try again.');
      setOutputText('');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = window.setTimeout(() => {
      performTranslation(inputText);
    }, 500); // 500ms debounce

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [inputText, performTranslation]);

  const handleCopyAll = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const SkeletonLoader = () => (
    <div className="p-4 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
      <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
        <div className="h-4 bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-700 rounded w-4/5"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
            Polyglot Translator
          </h1>
          <p className="mt-2 text-slate-400">
            Instantly translate between Japanese, Chinese, English, and Korean as you type.
          </p>
        </header>

        <main>
          <div className="bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Start typing to translate... (Japanese, Traditional Chinese, English, or Korean)"
              className="w-full h-36 p-3 bg-slate-900/50 rounded-md border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 resize-none text-lg placeholder:text-slate-500"
              disabled={isLoading}
              aria-label="Input for translation"
            />
            <div className="mt-4 flex justify-between items-center">
              <div className="h-6">
                {isLoading && (
                   <div className="flex items-center gap-2 text-slate-400">
                     <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     <span>Translating...</span>
                   </div>
                )}
              </div>
               <button
                onClick={handleCopyAll}
                disabled={!outputText || isLoading}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-500 disabled:bg-slate-700 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Copy all translations"
              >
                {isCopied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2V10a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy All
                  </>
                )}
               </button>
            </div>
          </div>
          
          {error && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-md text-center">
              {error}
            </div>
          )}

          <div className="mt-8">
            {isLoading && <SkeletonLoader />}
            {!isLoading && outputText && (
              <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700">
                <div className="p-4" aria-live="polite">
                  <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed font-sans text-lg">
                    {outputText}
                  </pre>
                </div>
              </div>
            )}
             {!isLoading && !outputText && inputText && !error && (
              <div className="text-center text-slate-500 pt-8">Awaiting translation results...</div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;
