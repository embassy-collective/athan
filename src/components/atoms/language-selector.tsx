import { cn } from '@/lib/styles';
import { useState } from 'react';
import Select from 'react-select-virtualized';

interface Option {
  value: string;
  lowercaseLabel: string;
  label: string;
}

interface LanguageSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const LanguageSelector = ({ value, onValueChange }: LanguageSelectorProps) => {
  const controlStyles = {
    base: 'border rounded bg-foreground hover:cursor-pointer  rtl:font-arabic',
    focus: 'border-accent ring-1 ring-accent',
    nonFocus: 'border-black hover:border-black'
  };
  const placeholderStyles = 'rtl:font-arabic text-primary/60 px-2 py-0.5';
  const selectInputStyles = 'pl-1 py-0.5  rtl:font-arabic';
  const valueContainerStyles = 'p-1 gap-1  rtl:font-arabic';
  const singleValueStyles = 'leading-7 ml-1';
  ('border border-accent bg-white hover:bg-red-50 hover:text-red-800 text-background hover:border-red-300 rounded-md');
  const indicatorsContainerStyles = 'p-1 gap-1';
  const clearIndicatorStyles = 'hidden text-background p-1 rounded-md hover:text-red-400';
  const indicatorSeparatorStyles = 'hidden';
  const dropdownIndicatorStyles = 'p-1 text-background rounded-md hover:text-accent';
  const menuStyles = 'p-1 mt-2 border border-black text-primary bg-foreground rounded-lg';

  const customSelectProps = {
    unstyled: true,
    classNames: {
      listBox: () => 'border border-gray-200 rounded-lg',
      control: ({ isFocused }: { isFocused: boolean }) =>
        cn(isFocused ? controlStyles.focus : controlStyles.nonFocus, controlStyles.base),
      placeholder: () => placeholderStyles,
      input: () => selectInputStyles,
      valueContainer: () => valueContainerStyles,
      singleValue: () => singleValueStyles,
      indicatorsContainer: () => indicatorsContainerStyles,
      clearIndicator: () => clearIndicatorStyles,
      indicatorSeparator: () => indicatorSeparatorStyles,
      dropdownIndicator: () => dropdownIndicatorStyles,
      menu: () => menuStyles
    }
  };

  const [selectedLanguage, setSelectedLanguage] = useState(value);

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية' }
  ];

  return (
    <div>
      <Select
        {...customSelectProps}
        value={languages.find((lang) => lang.value === selectedLanguage)}
        className="w-56"
        onChange={(value: Option) => {
          const lang = value.value;
          if (!lang) return;
          setSelectedLanguage(lang);
          onValueChange(lang);
        }}
        options={languages.map((lang) => ({ value: lang.value, label: lang.label }))}
      />
    </div>
  );
};

export default LanguageSelector;
