import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PrescriptionModule } from './prescription/prescription.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PatientModule } from './patient/patient.module';
import { DrugModule } from './drug/drug.module';
import { DashboardModule } from './dashboard/dashboard.module';



const URL = "mongodb://127.0.0.1/medical_system"
@Module({
  imports: [
    MongooseModule.forRoot(URL),
    UserModule, // Add UserModule here
    AuthModule,
    PatientModule,
    PrescriptionModule,
    DrugModule,
    DashboardModule
  ],
  controllers: [
    
  ],
  providers: [
    AppService, 
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard
    // }             //For Global Usage
  ],
})
export class AppModule {}
