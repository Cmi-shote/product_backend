import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(5)
    password: string;
}

export class SigninDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}