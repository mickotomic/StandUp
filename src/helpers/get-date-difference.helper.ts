export default function getDateDifference(date1: Date, date2: Date): number {
  return (date1.getTime() - date2.getTime()) / (1000 * 3600 * 24);
}
