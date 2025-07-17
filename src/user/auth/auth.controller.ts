import { Body, Controller, Param, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, SigninDto } from '../dtos/auth.dto';

@Controller('auth')
export class AuthController {
constructor(
    private readonly authService: AuthService,
) {}
    @Post('/signup')
    async signup(
        @Body() body: SignupDto,
    ) {
        return this.authService.signup(body);
    }

    @Post('/signin')
    signin(
        @Body() body: SigninDto
    ) {
        return this.authService.signin(body);
    }
}
