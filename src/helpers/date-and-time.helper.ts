// let's extend this function
export function formatDate(date: Date = new Date()): string {
  if (!(date instanceof Date)) {
    throw new Error('Invalid date!');
  }

  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}
