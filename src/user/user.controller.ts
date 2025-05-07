import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserRoleDto } from './dto/edit-user-role.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/auth/roles.enum';
import { RequireRoles } from 'src/decorator/roles.decorator';
import { EditUserDto } from './dto/edit-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

// @RequireRoles(Roles.Admin) // Ensure role restriction is specific to this route
// @UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('User')
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('stats')
  getUserStats() {
    return this.userService.getUserStats();
  }

  @Get()
  getAllUsers(
    @Query() query: { page: number; limit: number; status?: boolean },
  ) {
    const { page, limit, status } = query;

    return this.userService.findAll(page, limit, status);
  }

  @Put('update/:id')
  @RequireRoles(Roles.Admin)
  @ApiBody({ type: EditUserDto })
  editRole(@Body() editUserDto: EditUserDto, @Param('id') id: string) {
    return this.userService.updateUser(id, editUserDto);
  }

  @Get('search-by-name')
  @RequireRoles(Roles.Admin)
  findByNameOrEmail(
    @Query('name') name: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.userService.findByNameOrEmail(name, page, limit);
  }

  @Patch('settings')
  @RequireRoles(Roles.Admin)
  async updateSettings(@Request() req, @Body() settings: Record<string, any>) {
    // console.log(req)uuhu
    return this.userService.updateCustomSettings(req.user._id, settings);
  }

  @Get('settings')
  async fetchSettings(@Request() req) {
    // console.log(req)uuhu
    return this.userService.getCustomSettings(req.user._id);
  }
  @Get('by-id/:id')
  @RequireRoles(Roles.Admin)
  findOne(@Param('id') id: string) {
    console.log('hi', id);
    return this.userService.findById(id);
  }
  @Get('by-role/:role')
  @RequireRoles(Roles.Admin)
  getUserByRole(@Param('role') role: string) {
    return this.userService.findUsersByRole(role);
  }
  @Delete(':id')
  @RequireRoles(Roles.Admin)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
