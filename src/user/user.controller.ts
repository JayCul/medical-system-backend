import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserRoleDto } from './dto/edit-user-role.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/auth/roles.enum';
import { RequireRoles } from 'src/decorator/roles.decorator';
import { EditUserDto } from './dto/edit-user.dto';

// @UseGuards(AuthGuard('jwt'), RolesGuard) // Combine guards for efficiency
@Controller('user')
// @RequireRoles(Roles.Admin) // Ensure role restriction is specific to this route
export class UserController {
  constructor(private readonly userService: UserService) {}

  
  
  @Get()
  // @RequireRoles(Roles.Admin) 
  getAllUsers(@Query() query : {page: number; limit: number; status?: boolean}){
    const {page, limit, status} = query;
         
      return this.userService.findAll(page, limit, status);
    }
    
    @Get('stats')
    getUserStats(){
      return this.userService.getUserStats()
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('update/:id')
    editRole(@Body() editUserDto: EditUserDto, @Param ('id') id: string) {
      return this.userService.updateUser(id, editUserDto);
    }
  
    
    @Get('search-by-name')
    findByNameOrEmail(@Query('name') name: string, @Query('page') page: number, @Query('limit') limit: number) {
      return this.userService.findByNameOrEmail(name, page, limit);
    }
    
    @Patch('settings')
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
    findOne(@Param('id') id: string) {
      console.log("hi", id)
      return this.userService.findById(id);
    }
    @Get('by-role/:role')
    getUserByRole(@Param('role') role: string){
      return this.userService.findUsersByRole(role)
    }
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.userService.remove(id);
    }
    
  }
  