import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'), RolesGuard)
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
