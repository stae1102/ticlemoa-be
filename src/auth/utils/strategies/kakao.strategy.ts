import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { AuthService } from '../../auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService, private readonly authService: AuthService) {
    super({
      clientID: configService.get<string>('KAKAO_CLIENT_ID'),
      clientSecret: configService.get<string>('KAKAO_SECRET'),
      callbackURL: configService.get<string>('KAKAO_CALLBACK_URL'),
      scopeSeparator: ['profile', 'email'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile, done: CallableFunction) {
    console.log(profile);
    const { id, displayName: nickname, provider } = profile;
    const profileJson = profile._json;
    const kakao_account = profileJson.kakao_account;
    const email = kakao_account.has_email && kakao_account.is_email_valid ? kakao_account.email : null;

    const user = { id, email, nickname, provider };
    done(null, user);
  }
}
