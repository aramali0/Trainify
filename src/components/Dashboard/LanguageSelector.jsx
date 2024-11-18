import React from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';

// Define your language options
const languageOptions = [
  {
    value: 'en',
    label: (
      <div className="flex items-center space-x-2">
        <ReactCountryFlag countryCode="US" svg style={{ width: '1.5em', height: '1.5em' }} title="English" />
        <span className='hidden md:inline-block'>English</span>
      </div>
    ),
  },
  {
    value: 'fr',
    label: (
      <div className="flex items-center space-x-2">
        <ReactCountryFlag countryCode="FR" svg style={{ width: '1.5em', height: '1.5em' }} title="Français" />
        <span className='hidden md:inline-block'>Français</span>
      </div>
    ),
  },
  {
    value: 'ar',
    label: (
      <div className="flex items-center space-x-2">
        <ReactCountryFlag countryCode="MA" svg style={{ width: '1.5em', height: '1.5em' }} title="العربية" />
        <span className='hidden md:inline-block'>العربية</span>
      </div>
    ),
  },
];

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minWidth: 30,
    maxWidth: 150,
    borderRadius: '0.5rem',
    borderColor: state.isFocused ? '#2563EB' : '#D1D5DB', // Tailwind Blue-600 or Gray-300
    boxShadow: state.isFocused ? '0 0 0 1px #2563EB' : 'none',
    '&:hover': {
      borderColor: '#2563EB',
    },
    padding: '0.25rem',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#2563EB'
      : state.isFocused
      ? '#EFF6FF' // Tailwind Blue-100
      : 'white',
    color: state.isSelected ? 'white' : 'black',
    cursor: 'pointer',
  }),
  singleValue: (provided) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '0.5rem',
    marginTop: '0.25rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  }),
};

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  // Find the current language option
  const currentLanguage = languageOptions.find((lang) => lang.value === i18n.language) || languageOptions[0];

  const handleChange = (selectedOption) => {
    i18n.changeLanguage(selectedOption.value);
  };

  return (
    <div className="w-30  md:w-100">
      <Select
        value={currentLanguage}
        onChange={handleChange}
        options={languageOptions}
        styles={customStyles}
        isSearchable={false}
        theme={(theme) => ({
          ...theme,
          borderRadius: 8,
          colors: {
            ...theme.colors,
            primary: '#2563EB', // Tailwind Blue-600
            primary25: '#EFF6FF', // Tailwind Blue-100
          },
        })}
      />
    </div>
  );
};

export default LanguageSelector;
