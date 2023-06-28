export function isEmail(email: string): boolean {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (email.match(regex)) {
    return true;
  }
  return false;
}
