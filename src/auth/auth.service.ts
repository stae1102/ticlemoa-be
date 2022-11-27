import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ValidateUserDto } from './dto/validate-user.dto';
import { AuthProvider } from '../entities/types/auth-provider.interface';
import { User } from '../entities/user.entity';
import { UserRepository } from '../user/repository/user.repository';
import { JwtSubjectType } from './types/jwt.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async validateUser(validateUserDto: ValidateUserDto): Promise<User> {
    const { snsId, email, nickname, provider } = validateUserDto;
    const exUser = await this.userRepository.findOne({
      where: { snsId },
    });
    if (!exUser) {
      const newUser = await this.userRepository.save({
        snsId,
        email,
        nickname,
        provider: AuthProvider[provider],
      });
      return newUser;
    }
    return exUser;
  }

  async validateJwt(id: number, provider: AuthProvider) {
    return await this.userRepository.findOneOrFail({ where: { id, provider } });
  }

  generateAccessToken(user: User): string {
    return this.jwtService.sign(
      { id: user.id, provider: user.provider },
      {
        subject: JwtSubjectType.ACCESS,
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`,
      },
    );
  }

  generateRefreshToken(user: User): string {
    return this.jwtService.sign(
      { id: user.id, provider: user.provider },
      {
        subject: JwtSubjectType.REFRESH,
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
      },
    );
  }
}
