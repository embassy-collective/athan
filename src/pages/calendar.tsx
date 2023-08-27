import DatePicker from '@/components/atoms/date-picker';
import PrayersTable from '@/components/molecules/prayers-table';
import { useState } from 'react';
import Layout from '../components/templates/layout';
import { useTranslation } from 'react-i18next';

const Calendar = () => {
  const { t, i18n } = useTranslation();
  const [date, setDate] = useState<Date>(new Date());

  return (
    <Layout>
      <div className="flex flex-row h-full mr-20">
        <div className="flex flex-col justify-center flex-grow h-full gap-8">
          <div className="flex flex-row items-center justify-between gap-8">
            <h1 className="text-[48px] font-semibold">
              {i18n.dir() === "ltr" && (
                <>
                  {t('Monthly')} <span className="text-accent">{t('Calendar')}</span>
                </>
              )}

              {i18n.dir() === "rtl" && (
                <>
                  <span className="text-accent">{t('Calendar')}</span> {t('Monthly')}
                </>
              )}
            </h1>

            <DatePicker value={date} onChange={setDate} className="justify-end w-1/2" />
          </div>

          <div className="relative w-full overflow-y-auto">
            <PrayersTable date={date} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;
