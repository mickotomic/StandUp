export function isEmail(email: string): RegExpMatchArray | null {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return email.match(regex);
}
