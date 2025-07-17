import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken";

interface SignupParams {
    email: string;
    password: string;
    name: string
}

interface SigninParams {
    email: string;
    password: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService){}

    async signup({email, password, name}: SignupParams) {
        const userExists = await this.prismaService.user.findUnique({
            where: { email },
        });

        if (userExists) {
        throw new Error('User already exists');
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const user = await this.prismaService.user.create({
        data: {
            email: email,
            password: hashPassword,
            name: name
        },
        });
        
        return this.generateJWT(user.name, user.id);
    }  

    async signin({email, password}: SigninParams) {
        const user = await this.prismaService.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new HttpException('Invalid credentials', 400);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new HttpException('Invalid credentials', 400);
        }

        return this.generateJWT(user.name, user.id);
    }

    private generateJWT(name: string, id: number) {
        if (!process.env.JSON_TOKEN_KEY) {
            throw new Error('JWT secret key is not defined in environment variables');
        }
        return jwt.sign({ id, name }, process.env.JSON_TOKEN_KEY, {
            expiresIn: 35 * 24 * 60 * 60 // 35 days,
        });
    }
}
