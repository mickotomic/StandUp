import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { GoogleOAuth } from 'src/types/google-profile.type';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google-oauth') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL:
        process.env.BASE_URL + process.env.APP_PORT + '/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    _refreshToken: string,
    profile: GoogleOAuth,
    done: VerifyCallback,
  ) {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      accessToken,
    };
    done(null, user);
  }
}
