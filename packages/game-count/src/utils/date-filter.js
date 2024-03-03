import dayjs from 'dayjs';

export function filterDate(date) {
  if (date) return dayjs(date).format('YYYY-MM-DD');
  return '--';
}

export function filterDateTime(date) {
  if (date) return dayjs(date).format('YYYY-MM-DD HH:mm');
  return '--';
}

export function filterDateTimeLong(date) {
  if (date) return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
  return '--';
}

export function filterTwoDate(startDate, endDate) {
  if (startDate && endDate)
    return `${dayjs(startDate).format('YYYY-MM-DD')} - ${dayjs(endDate).format('YYYY-MM-DD')}`;
  return '--';
}

export function filterTwoTime(startTime, endTime) {
  if (startTime && endTime)
    return `${dayjs(startTime).format('HH:mm')} - ${dayjs(endTime).format('HH:mm')}`;
  return '--';
}
