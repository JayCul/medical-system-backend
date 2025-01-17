import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { EditUserRoleDto } from './dto/edit-user-role.dto';
import { EditUserDto } from './dto/edit-user.dto';

const saltOrRounds = 10;

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<{ user; message }> {
    const { username, email, password } = createUserDto;

    const existingUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new BadRequestException('Username or Email already exists');
    }

    const hash = await bcrypt.hash(password, saltOrRounds);
    const newUser = new this.userModel({ ...createUserDto, password: hash });
    await newUser.save();
    return { user: newUser, message: 'User created successfully' };
  }

  private async paginate(query: any, page: number, limit: number): Promise<{
    data: User[];
    totalPages: number;
    totalItems: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    rangeStart: number;
    rangeEnd: number;
  }> {
    if (page < 1 || limit < 1) {
      throw new Error('Page and limit must be positive numbers.');
    }

    const totalItems = await this.userModel.countDocuments(query).exec();
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (page - 1) * limit;

    const data = await this.userModel
      .find(query) 
      .sort({ username: 1 })
      .select('-password')
      .skip(skip)
      .limit(limit)
      .exec();

    const rangeStart = skip + 1;
    const rangeEnd = Math.min(skip + limit, totalItems);

    return {
      data,
      totalPages,
      totalItems,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      rangeStart,
      rangeEnd,
    };
  }

  async findAll(page: number, limit: number, status?: boolean) {
    const filter = status !== undefined ? { isActive: status } : {}; 
    return this.paginate(filter, page, limit);
  }

  async findByNameOrEmail(name: string, page: number, limit: number) {
    const regex = new RegExp(name, 'i');
    return this.paginate(
      { $or: [{ username: regex }, { email: regex }] },
      page,
      limit,
    );
  }

  async getUserStats(){
    const totalUsers = await this.userModel.countDocuments()
    const activeUsers = await this.userModel.countDocuments({isActive: true})
    const inActiveUsers = await this.userModel.countDocuments({isActive: false})
 
    let userStats = {totalUsers, activeUsers, inActiveUsers}
    return userStats
  }

  async findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateUser(id:string, editUserDto: EditUserDto): Promise<{ message: string; updatedUser: User }> {
    // Exclude password and username from updates
    const { password, username, ...otherUpdates } = editUserDto;
    const user = await this.userModel.findById(id).select('-password');
    // const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
  
  
    // Update other fields
    Object.assign(user, otherUpdates);
  
    await user.save();
    return {
      message: `User ${username} updated successfully`,
      updatedUser: user,
    };
  }
  

  async updateCustomSettings(userId: string, settings: Record<string, any>): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $set: { customSettings: settings } },
        { new: true },
      )
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async getCustomSettings(userId: string): Promise<Record<string, any>> {
    const user = await this.userModel.findById(userId).select('customSettings').exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user.customSettings;
  }
}
