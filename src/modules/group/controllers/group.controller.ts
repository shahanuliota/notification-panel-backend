import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    Post,
    Query
} from "@nestjs/common";
import {GroupCreateDto} from "../dtos/create.group.dto";
import {AuthAdminJwtGuard, AuthJwtGuard} from "../../../common/auth/decorators/auth.jwt.decorator";
import {GetUser} from "../../user/decorators/user.decorator";
import {IUserDocument} from "../../user/user.interface";
import {IResponsePaging} from "../../../common/response/response.interface";
import {UserProfileGuard} from "../../user/decorators/user.public.decorator";
import {PaginationService} from "../../../common/pagination/services/pagination.service";
import {GroupService} from "../services/group.service";
import {Response, ResponsePaging} from "../../../common/response/decorators/response.decorator";
import {ENUM_AUTH_PERMISSIONS} from "../../../common/auth/constants/auth.enum.permission.constant";
import {AppGroupDocument} from "../schemas/app-groups.schema";
import {GroupGetSerialization} from "../serializations/group.get.serialization";
import {ENUM_GROUP_STATUS_CODE_ERROR} from "../constant/group.status-code.constant";
import {ENUM_ERROR_STATUS_CODE_ERROR} from "../../../common/error/constants/error.status-code.constant";
import {GroupListDto} from "../dtos/group.list.dto";
import {RequestParamGuard} from "../../../common/request/decorators/request.decorator";
import {GroupRequestDto} from "../dtos/group.request.dto";
import {GetGroup} from "../decorators/group.decorator";
import {GroupDeleteGuard} from "../decorators/group.admin.decorator";
import {IGroup} from "../group.interface";


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

    @Response('group.create', {classSerialization: GroupGetSerialization})
    @UserProfileGuard()
    @AuthJwtGuard(
        ENUM_AUTH_PERMISSIONS.GROUP_READ,
        ENUM_AUTH_PERMISSIONS.GROUP_CREATE
    )
    @Post('/create')
    async createGroup(@Body() dto: GroupCreateDto, @GetUser() user: IUserDocument): Promise<IGroup> {
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
            const res: IGroup = new IGroup(data);
            return data['_doc'];
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                error: err.message,
            });
        }

    }

    @ResponsePaging('group.list', {classSerialization: GroupGetSerialization})
    @UserProfileGuard()
    @AuthJwtGuard(
        ENUM_AUTH_PERMISSIONS.GROUP_READ,
    )
    @Get('/list')
    async list(
        @Query()
            {
                page,
                perPage,
                sort,
                search,
                availableSort,
                availableSearch,
                isActive,
            }: GroupListDto, @GetUser() user: IUserDocument
    ): Promise<IResponsePaging> {


        const skip: number = await this.paginationService.skip(page, perPage);
        const find: Record<string, any> = {
            isActive: {
                $in: isActive,
            },
            owner: user._id,
            ...search,
        };

        const groups: AppGroupDocument[] =
            await this.groupServices.findAll(find, {
                skip: skip,
                limit: perPage,
                sort,
            });

        const totalData: number = await this.groupServices.getTotal(find);
        const totalPage: number = await this.paginationService.totalPage(
            totalData,
            perPage
        );

        return {
            totalData,
            totalPage,
            currentPage: page,
            perPage,
            availableSearch,
            availableSort,
            data: groups,
        };
    }


    @Response('group.delete', {classSerialization: GroupGetSerialization})
    @GroupDeleteGuard()
    @RequestParamGuard(GroupRequestDto)
    @AuthAdminJwtGuard(
        ENUM_AUTH_PERMISSIONS.GROUP_READ,
        ENUM_AUTH_PERMISSIONS.GROUP_DELETE
    )
    @Delete('/delete/:group')
    async delete(@GetGroup() group: AppGroupDocument): Promise<void> {
        try {
            await this.groupServices.deleteOne(group);
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                error: err.message,
            });
        }
        return;
    }
}