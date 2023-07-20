export default function calculateSubscriptionPrice(
  numberOfUsers: number,
): number {
  if (numberOfUsers > 4 && numberOfUsers < 10) {
    return 5;
  } else if (numberOfUsers > 9 && numberOfUsers < 15) {
    return 4;
  } else if (numberOfUsers > 14) {
    return 3;
  }
}
