import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DrugService } from './drug.service';
import { InjectModel } from '@nestjs/mongoose';
import { DrugDto } from './dto/drug.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Drug')
@UseGuards(AuthGuard('jwt'))
@Controller('drug')
@ApiBearerAuth('access-token')
export class DrugController {
  constructor(private readonly drugService: DrugService) {}

  @Get('search-by-name')
  @ApiQuery({ name: 'name', required: true, type: Number, example: 'Panadol' })
  @ApiQuery({ name: 'page', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: true, type: Number, example: 10 })
  async searchDrugsbyName(
    @Query('name') name: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.drugService.searchDrugsByName(name, page, limit);
  }

  @Get(':id')
  async searchDrugsbyId(@Param('id') id: string) {
    return this.drugService.searchDrugsById(id);
  }

  @Get(':id/usage')
  async getDrugUsage(@Param('id') id: string) {
    return this.drugService.getDrugUsageForms(id);
  }

  @Post('create')
  @ApiBody({ type: DrugDto })
  async createDrug(@Body() createDrugDto: DrugDto) {
    return this.drugService.create(createDrugDto);
  }

  @Put('update/:id')
  @ApiBody({ type: DrugDto })
  async updateDrug(@Param('id') id: string, @Body() createDrugDto: DrugDto) {
    return this.drugService.updateDrugById(id, createDrugDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.drugService.delDrugbyId(id);
  }

  @Get()
  @ApiQuery({ name: 'page', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: true, type: Number, example: 10 })
  async getAllDrugs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.drugService.fetchDrugs(page, limit);
  }
}
