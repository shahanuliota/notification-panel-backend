import {Body, Controller, Get, Post, Query} from "@nestjs/common";
import {CreateApplicationDto} from "../dtos/create.application.dto";
import {PaginationService} from "../../../common/pagination/services/pagination.service";
import {ApplicationService} from "../services/application.service";
import {UserProfileGuard} from "../../user/decorators/user.public.decorator";
import {AuthAdminJwtGuard, AuthJwtGuard} from "../../../common/auth/decorators/auth.jwt.decorator";
import {ENUM_AUTH_PERMISSIONS} from "../../../common/auth/constants/auth.enum.permission.constant";
import {GetUser} from "../../user/decorators/user.decorator";
import {IUserDocument} from "../../user/user.interface";
import {IResponse, IResponsePaging} from "../../../common/response/response.interface";
import {ApplicationDocument} from "../schemas/application.schema";
import {Response, ResponsePaging} from "../../../common/response/decorators/response.decorator";
import {ApplicationGetSerialization} from "../serialization/application.get.serialization";
import {ListApplicationDto} from "../dtos/list.application.dto";
import {IApplicationDocument} from "../application.interface";
import {RequestParamGuard} from "../../../common/request/decorators/request.decorator";
import {GetApplication} from "../decorators/application.decorator";
import {ApplicationRequestDto} from "../dtos/application.request.dto";
import {ApplicationGetGuard} from "../decorators/application.admin.decorator";

@Controller({
    version: '1',
    path: '/application',
})
export class ApplicationController {

    constructor(private readonly paginationService: PaginationService,
                private readonly applicationService: ApplicationService) {
    }


    @Response('application.create', {
        classSerialization: ApplicationGetSerialization
    })
    @UserProfileGuard()
    @AuthJwtGuard(
        ENUM_AUTH_PERMISSIONS.APPLICATION_READ,
        ENUM_AUTH_PERMISSIONS.APPLICATION_CREATE
    )
    @Post('create')
    async create(@Body() dto: CreateApplicationDto, @GetUser() user: IUserDocument): Promise<IResponse> {
        const data1: ApplicationDocument = await this.applicationService.create(dto, user);
        return {...data1["_doc"]};
    }


    @ResponsePaging('application.list', {classSerialization: ApplicationGetSerialization})
    @UserProfileGuard()
    @AuthJwtGuard(
        ENUM_AUTH_PERMISSIONS.APPLICATION_READ,
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
            }: ListApplicationDto, @GetUser() user: IUserDocument
    ): Promise<IResponsePaging> {
        const skip: number = await this.paginationService.skip(page, perPage);
        const find: Record<string, any> = {
            isActive: {
                $in: isActive,
            },
            owner: user._id,
            ...search,
        };
        const applications: IApplicationDocument[] =
            await this.applicationService.findAll<IApplicationDocument>(find, {
                skip: skip,
                limit: perPage,
                sort,
            });
        const totalData: number = await this.applicationService.getTotal(find);
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
            data: applications,
        };
    }

    @Response('role.get',)
    @ApplicationGetGuard()
    @RequestParamGuard(ApplicationRequestDto)
    @AuthAdminJwtGuard(ENUM_AUTH_PERMISSIONS.APPLICATION_READ)
    @Get('get/:application')
    async get(@GetApplication() app: IApplicationDocument): Promise<IResponse> {
        return app;
    }


}