import {Body, Controller, Get, Post} from "@nestjs/common";
import {CreateApplicationDto} from "../dtos/create.application.dto";

@Controller({
    version: '1',
    path: '/application',
})
export class ApplicationController {

    @Get('/hello')
    async hello() {
        return "hello masud";
    }


    @Post('create')
    async create(@Body() dto: CreateApplicationDto) {
        return {dto};
    }

}