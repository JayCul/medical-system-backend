import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';


@Controller('dashboard')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('doctor')
  // @Roles(Role.Doctor)
  doctorDashboard(){
    return 'Welcome Doctor!'
  }

  @Get('nurse')
  // @Roles(Role.Nurse)
  nurseDashboard(){
    return 'Welcome Nurse!'
  }
  
  @Get('pharmacist')
  // @Roles(Role.Pharmacist)
  pharmacistDashboard(){
    return 'Welcome Pharm!'
  }
}
