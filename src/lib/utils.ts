import { type ClassValue, clsx } from 'clsx';
import { format, isToday, isYesterday } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateCode = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  // eslint-disable-next-line
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

export function snakeCaseToTitleCase(str: string) {
  return str
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);

  if (isToday(date)) {
    return 'Today';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }

  return format(date, 'EEEE, MMMM d');
};
