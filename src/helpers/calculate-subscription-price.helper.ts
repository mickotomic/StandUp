export default function calculateSubscriptionPrice(
  numberOfUsers: number,
): number {
  let price = 0;
  if (numberOfUsers > 4 && numberOfUsers < 10) {
    price = 5;
  } else if (numberOfUsers > 9 && numberOfUsers < 15) {
    price = 4;
  } else if (numberOfUsers > 14) {
    price = 3;
  }
  return price;
}
