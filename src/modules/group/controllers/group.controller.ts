import {BadRequestException, Body, Controller, Get, InternalServerErrorException, Post} from "@nestjs/common";
import {GroupCreateDto} from "../dtos/create.group.dto";
import {AuthJwtGuard} from "../../../common/auth/decorators/auth.jwt.decorator";
import {GetUser} from "../../user/decorators/user.decorator";
import {IUserDocument} from "../../user/user.interface";
import {IResponse} from "../../../common/response/response.interface";
import {UserProfileGuard} from "../../user/decorators/user.public.decorator";
import {PaginationService} from "../../../common/pagination/services/pagination.service";
import {GroupService} from "../services/group.service";
import {Response} from "../../../common/response/decorators/response.decorator";
import {ENUM_AUTH_PERMISSIONS} from "../../../common/auth/constants/auth.enum.permission.constant";
import {AppGroupDocument} from "../schemas/app-groups.schema";
import {GroupGetSerialization} from "../serializations/group.get.serialization";
import {ENUM_GROUP_STATUS_CODE_ERROR} from "../constant/group.status-code.constant";
import {ENUM_ERROR_STATUS_CODE_ERROR} from "../../../common/error/constants/error.status-code.constant";


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

    @Response('group.create', {classSerialization: GroupGetSerialization})
    @UserProfileGuard()
    @AuthJwtGuard(
        ENUM_AUTH_PERMISSIONS.GROUP_READ,
        ENUM_AUTH_PERMISSIONS.GROUP_CREATE
    )
    @Post('/create')
    async createGroup(@Body() dto: GroupCreateDto, @GetUser() user: IUserDocument): Promise<IResponse> {
        const exist = await this.groupServices.findOne({
            name: dto.name,
            owner: user._id
        });
        if (exist) {
            throw new BadRequestException({
                statusCode: ENUM_GROUP_STATUS_CODE_ERROR.GROUP_EXIST_ERROR,
                message: 'group.error.exist',
            });
        }
        
        try {

            const data: AppGroupDocument = await this.groupServices.create(dto, user);
            return {
                'id': data._id,
                name: data.name,
                description: data.description,
                owner: data.owner,
            };
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                error: err.message,
            });
        }

    }
}