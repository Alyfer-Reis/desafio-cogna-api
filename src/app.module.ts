import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infra/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna o modulo visivel em todo lugar
      envFilePath: '.env', // Garante que ele aponte para o arquivo na raiz
    }),
    DatabaseModule,
    AuthModule,
    TaskModule,
  ],
})
export class AppModule {}
