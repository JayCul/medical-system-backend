import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Roles } from "src/auth/roles.enum";

export class EditUserRoleDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    // @IsString()
    // @IsNotEmpty()
    @IsEnum(Roles, { message: "Role must be one of the following: admin, doctor, nurse, pharmacist, user" })
    role: Roles;
    
}