import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth('access-token')

export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboardStats(@Request() req) {
    // console.log(req)
    const user = req.user; // Retrieved from JWT
    return this.dashboardService.getDashboardStats(user);
  }
  
  @Get('data')
  async generalMetric() {
    return this.dashboardService.fetchDashboardMetrics();
  }
}
