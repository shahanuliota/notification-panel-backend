import {Body, Controller, Delete, Get, Post, Put, Query, Req} from "@nestjs/common";
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
import {ApplicationUpdateDto} from "../dtos/update.application.dto";
import {AuthApiService} from "../../../common/auth/services/auth.api.service";
import {IAuthApiRequestHashedData} from "../../../common/auth/auth.interface";
import {AuthApiDocument} from "../../../common/auth/schemas/auth.api.schema";
import {TaskScheduleDto} from "../dtos/task.schedule.dto";

@Controller({
    version: '1',
    path: '/application',
})
export class ApplicationController {

    constructor(private readonly paginationService: PaginationService,
                private readonly applicationService: ApplicationService,
                private readonly authApiService: AuthApiService,
    ) {
    }


    @Get('/hello')
    async hello() {
        const apiKey = 'qwertyuiop12345zxcvbnmkjh';
        const authApi: AuthApiDocument = await this.authApiService.findOneByKey(
            apiKey
        );
        const apiEncryption = await this.authApiService.encryptApiKey(
            {
                key: 'masud valo na ' + apiKey,
                timestamp: 1666240557875,
                hash: 'e11a023bc0ccf713cb50de9baa5140e59d3d4c52ec8952d9ca60326e040eda54',
            },
            authApi.encryptionKey,
            authApi.passphrase
        );
        const xApiKey = `${apiKey}:${apiEncryption}`;
        return {xApiKey, 'len': xApiKey.length};
    }


    @Get('/hello/decript')
    async decript(@Query('apiKey') apiKey: string, @Req() req) {


        console.log({apiKey});

        apiKey = req.url.toString().split('?apiKey=')[1];

        const xApiKey: string[] = apiKey.split(':');
        console.log({len: apiKey.length});

        const encrypted = xApiKey[1];
        const key = xApiKey[0];
        const authApi: AuthApiDocument = await this.authApiService.findOneByKey(
            key
        );

        console.log({authApi});
        const decrypted: IAuthApiRequestHashedData =
            await this.authApiService.decryptApiKey(
                encrypted,
                authApi.encryptionKey,
                authApi.passphrase
            );
        return {decrypted};


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
        return {...data1};
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

    @Response('application.get', {
        classSerialization: ApplicationGetSerialization
    })
    @ApplicationGetGuard()
    @RequestParamGuard(ApplicationRequestDto)
    @AuthAdminJwtGuard(ENUM_AUTH_PERMISSIONS.APPLICATION_READ)
    @Get('get/:application')
    async get(@GetApplication() app: IApplicationDocument): Promise<IResponse> {
        return app;
    }

    @Response('application.get', {
        classSerialization: ApplicationGetSerialization
    })
    @ApplicationGetGuard()
    @RequestParamGuard(ApplicationRequestDto)
    @AuthAdminJwtGuard(ENUM_AUTH_PERMISSIONS.APPLICATION_READ)
    @Delete('delete/:application')
    async delete(@GetApplication() app: IApplicationDocument): Promise<IResponse> {
        return await this.applicationService.deleteOne<IApplicationDocument>({_id: app._id});
    }


    @Response('application.update')
    @ApplicationGetGuard()
    @RequestParamGuard(ApplicationRequestDto)
    @AuthAdminJwtGuard(
        ENUM_AUTH_PERMISSIONS.APPLICATION_READ,
        ENUM_AUTH_PERMISSIONS.APPLICATION_UPDATE
    )
    @Put('/update/:application')
    async update(@GetApplication() app: IApplicationDocument, @Body() dto: ApplicationUpdateDto): Promise<IResponse> {

        return await this.applicationService.update(app._id, dto);
    }


    @ApplicationGetGuard()
    @RequestParamGuard(ApplicationRequestDto)
    @AuthAdminJwtGuard(
        ENUM_AUTH_PERMISSIONS.APPLICATION_READ,
        ENUM_AUTH_PERMISSIONS.APPLICATION_UPDATE
    )
    @Put('/remove-group/:application')
    async removeGroup(@GetApplication() app: IApplicationDocument, @Body() dto: ApplicationUpdateDto): Promise<IResponse> {

        return await this.applicationService.removeGroup(app._id, dto);
    }

    // @Response('application.update')
    // @ApplicationGetGuard()
    // @RequestParamGuard(TaskScheduleDto)
    @AuthAdminJwtGuard()
    @Post('/schedule')
    async scheduleNotification(@Body() dto: TaskScheduleDto) {
        return {...dto};
    }


}