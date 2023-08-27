import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/atoms/table';
import usePrayerTimes from '@/hooks/usePrayerTimes';
import { PRAYERS } from '@/lib/config/prayers';
import { formatDate } from '@/lib/date';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/styles';
import { PrayerKey } from '@/types/prayer';
import { format, isSameDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../atoms/tooltip';

interface PrayersTableProps {
  date: Date;
}

export type TableEntry = {
  originalDate: Date;
  date: string; // Date as 01 Tue, 02 Wed, etc.
  isActive?: boolean;
} & Record<PrayerKey, string>;

interface Column {
  label: string;
  key: keyof TableEntry;
}

const PrayersTable = ({ date }: PrayersTableProps) => {
  const { t, i18n } = useTranslation();
  const { prayerTimesByDate } = usePrayerTimes();
  const { twentyFourHourTime } = useStore();
  const columns: Column[] = [
    {
      label: date.toLocaleString(i18n.language === 'ar' ? 'ar-Ma' : 'default', { month: 'long' }),
      key: 'date'
    },
    ...PRAYERS.map((prayer) => ({
      label: prayer,
      key: prayer
    }))
  ];

  const daysOfTheMonth: number[] = Array.from(
    { length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() },
    (_, i) => i + 1
  );

  const rows = daysOfTheMonth.map((day) => {
    const rowDate = new Date(date.getFullYear(), date.getMonth(), day);
    const dateLabel = rowDate.toLocaleString(i18n.language === 'ar' ? 'ar-Ma' : 'default', {
      day: '2-digit',
      weekday: 'short'
    });
    const times = prayerTimesByDate(date);
    const row: TableEntry = {
      originalDate: rowDate,
      date: dateLabel,
      ...PRAYERS.reduce(
        (acc, prayer) => {
          acc[prayer] = formatDate(times[prayer], twentyFourHourTime);
          return acc;
        },
        {} as Record<PrayerKey, string>
      ),
      isActive: isSameDay(rowDate, new Date())
    };

    return row;
  });

  console.log(rows);

  return (
    <Table>
      <TableHeader className="sticky top-0 rounded-t">
        <TableRow className="">
          {columns.map((column, i) => (
            <TableHead
              className={cn('px-4 capitalize bg-black text-accent rtl:font-arabic', {
                'w-48': i === 0
              })}
              key={column.key}
            >
              {t(column.label)}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.date}
            className={cn('cursor-pointer hover:bg-accent hover:text-foreground', {
              'bg-accent text-foreground': row.isActive
            })}
          >
            {columns.map((column) => (
              <TableCell className="px-4 rtl:font-arabic" key={column.key}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>{row[column.key] as string}</TooltipTrigger>
                    <TooltipContent>
                      {column.key === 'date' ? (
                        <p>{format(row.originalDate, 'do MMMM, yyyy')}</p>
                      ) : (
                        <p>
                          <span className="capitalize">{column.label}</span> is at {row[column.key] as string}
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PrayersTable;
