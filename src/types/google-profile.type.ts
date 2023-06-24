export type GoogleOAuth = {
  displayName: string;
  emails: { value: string; verified: boolean }[];
  id: string;
  name: { familyName: string; givenName: string };
  photos: { value: string }[];
  provider: string;
};
