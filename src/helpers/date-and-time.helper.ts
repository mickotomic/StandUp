export function formatDate(date: Date = new Date(), format = 'd-m-y'): string {
  if (!(date instanceof Date)) {
    throw new Error('Invalid date!');
  }

  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const formatTokens: { [key: string]: string } = {
    d: day,
    m: month,
    y: year,
  };

  const formattedDate = format.replace(
    /d|m|y/g,
    (match) => formatTokens[match],
  );

  return formattedDate;
}
