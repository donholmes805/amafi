
export const formatAMADate = (date: Date): string => {
  if (!date || isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Los_Angeles',
  });
};
