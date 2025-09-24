
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { LanguageIcon } from './LanguageIcon';

interface TranslationCardProps {
  language: Language;
  text: string;
  isLoading: boolean;
  isSource: boolean;
  hasContent: boolean; // New prop
}

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2V10a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);


export const TranslationCard: React.FC<TranslationCardProps> = ({ language, text, isLoading, isSource, hasContent }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  useEffect(() => {
    // Reset copied state when text changes
    setIsCopied(false);
  }, [text]);


  const SkeletonLoader = () => (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-slate-700 rounded w-3/4"></div>
      <div className="h-4 bg-slate-700 rounded w-full"></div>
      <div className="h-4 bg-slate-700 rounded w-5/6"></div>
    </div>
  );

  return (
    <div className={`bg-slate-800 rounded-lg shadow-lg border ${isSource ? 'border-sky-500' : 'border-slate-700'} ${!hasContent && !isLoading ? 'hidden' : 'flex'} flex-col transition-all duration-300`}>
      <header className="flex justify-between items-center p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <LanguageIcon language={language} className="text-2xl" />
          <h2 className="text-lg font-bold text-slate-200">{language}</h2>
          {isSource && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-sky-500/20 text-sky-300 rounded-full">
              Source
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          disabled={!text || isLoading}
          className="p-2 rounded-md text-slate-400 hover:bg-slate-700 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Copy to clipboard"
        >
          {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
        </button>
      </header>
      <div className="p-4 flex-grow min-h-[120px]">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
            {text || <span className="text-slate-500">Translation will appear here...</span>}
          </p>
        )}
      </div>
    </div>
  );
};
