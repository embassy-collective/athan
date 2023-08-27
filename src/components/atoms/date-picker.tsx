import { cn } from '@/lib/styles';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { isSameMonth } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface DatePickerProps {
  value: Date;
  className?: string;
  onChange: (date: Date) => void;
}

const DatePicker = ({ value, onChange, className }: DatePickerProps) => {
  const { t, i18n } = useTranslation();
  const [date, setDate] = useState<Date>(value);
  const month = date.toLocaleString(i18n.language === 'ar' ? 'ar-Ma' : 'default', {
    month: 'long'
  });
  const year = date.getFullYear();

  const handlePrevMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() - 1);
    setDate(newDate);
    onChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + 1);
    setDate(newDate);
    onChange(newDate);
  };

  const buttonsFlexDir: React.CSSProperties = {
    flexDirection: i18n.dir() === 'rtl' ? 'row-reverse' : 'row'
  };

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="flex items-center justify-between flex-grow max-w-xs px-4 py-2 border-2 rounded-lg border-accent">
        <span className="rtl:font-arabic">
          {month} {year}{' '}
        </span>
        {!isSameMonth(date, new Date()) && (
          <span
            onClick={() => {
              const newDate = new Date();
              setDate(newDate);
              onChange(newDate);
            }}
            className="text-xs cursor-pointer text-accent hover:underline rtl:font-arabic"
          >
            {t('Reset')}
          </span>
        )}
      </div>
      <div className="flex gap-2 font-bold" style={buttonsFlexDir}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div
                onClick={handlePrevMonth}
                className="flex items-center justify-center w-12 h-12 rounded-full cursor-pointer bg-accent"
              >
                <ChevronLeftIcon className="w-6 h-6 font-bold text-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('Previous month')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div
                onClick={handleNextMonth}
                className="flex items-center justify-center w-12 h-12 rounded-full cursor-pointer bg-accent"
              >
                <ChevronRightIcon className="w-6 h-6 font-bold text-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('Next month')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default DatePicker;
