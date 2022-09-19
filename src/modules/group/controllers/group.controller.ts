import {Body, Controller, Get, Post} from "@nestjs/common";
import {GroupCreateDto} from "../dtos/create.group.dto";
import {AuthJwtGuard} from "../../../common/auth/decorators/auth.jwt.decorator";
import {GetUser} from "../../user/decorators/user.decorator";
import {IUserDocument} from "../../user/user.interface";
import {IResponse} from "../../../common/response/response.interface";
import {UserProfileGuard} from "../../user/decorators/user.public.decorator";
import {PaginationService} from "../../../common/pagination/services/pagination.service";
import {GroupService} from "../services/group.service";
import {Response} from "../../../common/response/decorators/response.decorator";


@Controller({
    version: '1',
    path: '/group',
})
export class AppGroutController {

    constructor(
        private readonly paginationService: PaginationService,
        private readonly groupServices: GroupService
    ) {
    }

    @Get('/hello')
    async hello() {
        return 'hello';
    }

    @Response('group.create')
    @UserProfileGuard()
    @AuthJwtGuard()
    @Post('/create')
    async createGroup(@Body() dto: GroupCreateDto, @GetUser() user: IUserDocument): Promise<IResponse> {
        return this.groupServices.create(dto, user);
    }
}