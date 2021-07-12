import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, NotFoundException, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './models/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private authService: AuthService
    ) {}


    @Post('register')
    async register(@Body() body: RegisterDto) {
        const { password, password_confirm, first_name, last_name, email } = body;

        if (password !== password_confirm) {
            throw new BadRequestException('Contraseñas no son iguales');
        }

        const hashed = await bcrypt.hash(password, 12);
        return this.userService.create({
            first_name, last_name, email,
            password: hashed,
            role: { id: 1}
        });
    }

    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res({ passthrough: true }) response: Response
    ) {
        const user = await this.userService.findOne({email});
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        if (!await bcrypt.compare(password, user.password)) {
            throw new BadRequestException('Usuario o contraseña invalido');
        }

        const jwt = await this.jwtService.signAsync({id: user.id});
        response.cookie('jwt', jwt, {httpOnly: true});
        return user;
    }

    @UseGuards(AuthGuard)
    @Get('user')
    async user(@Req() request: Request) {
        const id = await this.authService.userId(request);
        return this.userService.findOne({id});
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(
        @Res({ passthrough: true }) response: Response
    ) {
        response.clearCookie('jwt');
        return {
            message: 'Success'
        }
    }
}
