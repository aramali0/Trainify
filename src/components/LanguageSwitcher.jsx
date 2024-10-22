// LanguageSwitcher.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    console.log(`Switching language to: ${lng}`);
    i18n.changeLanguage(lng, (err, t) => {
      if (err) return console.error('Something went wrong with language loading:', err);
      console.log(`Language switched to: ${lng}`);
    });
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('fr')}>French</button>
    </div>
  );
};

export default LanguageSwitcher;
