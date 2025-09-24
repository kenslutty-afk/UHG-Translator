
import React from 'react';
import { Language } from '../types';

interface LanguageIconProps {
  language: Language;
  className?: string;
}

export const LanguageIcon: React.FC<LanguageIconProps> = ({ language, className }) => {
  const getFlag = () => {
    switch (language) {
      case Language.JAPANESE:
        return '🇯🇵';
      case Language.TRADITIONAL_CHINESE:
        return '🇹🇼';
      case Language.ENGLISH:
        return '🇺🇸';
      case Language.KOREAN:
        return '🇰🇷';
      default:
        return '🌐';
    }
  };

  return <span className={className} role="img" aria-label={`${language} flag`}>{getFlag()}</span>;
};
