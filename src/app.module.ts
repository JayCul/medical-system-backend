import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PrescriptionModule } from './prescription/prescription.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PatientModule } from './patient/patient.module';
import { DrugModule } from './drug/drug.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisDBConfig, jwtConfig } from './config/database.config';
import { Connection } from 'mongoose';

// const URL = "mongodb://127.0.0.1/medical_system"

@Module({
  imports: [
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     uri: configService.get<string>('MONGO_URI'), // Use the MONGO_URI from the .env file
    //   }),
    // }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => console.log('connected'));
          connection.on('open', () => console.log('open'));
          connection.on('disconnected', () => console.log('disconnected'));
          connection.on('reconnected', () => console.log('reconnected'));
          connection.on('disconnecting', () => console.log('disconnecting'));

          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    // MongooseModule.forRoot(URL),
    AuthModule,
    UserModule, // Add UserModule here
    PatientModule,
    PrescriptionModule,
    DrugModule,
    DashboardModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [redisDBConfig, jwtConfig],
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
