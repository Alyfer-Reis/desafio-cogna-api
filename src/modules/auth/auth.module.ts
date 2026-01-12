import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserRepositoryPrisma } from 'src/infra/repository/prisma/user-repository.prisma';
import { AuthController } from 'src/modules/auth/auth.controller';
import { JwtStrategy } from '../../infra/auth/jwt.strategy';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1h',
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepositoryPrisma,
    },
  ],
})
export class AuthModule {}
