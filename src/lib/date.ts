import { format } from 'date-fns';

export const formatDate = (date: Date, is24Hour: boolean = false) => {
  if (!date) return '';

  return format(date, is24Hour ? 'HH:mm' : 'hh:mm a');
};
