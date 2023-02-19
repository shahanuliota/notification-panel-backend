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
import {ScheduleService} from "../services/schedule.service";
import {TaskScheduleDocument} from "../schemas/task_schedule.schema";
import {TaskScheduleRequestDto} from "../dtos/task.schedule.request.dto";
import {TaskScheduleGetGuard} from "../decorators/task.schedule.decorator";
import {GetTaskSchedule} from "../decorators/task-schedule.get.decorator";
import {HttpService} from "@nestjs/axios";
import {Cron, CronExpression, SchedulerRegistry} from "@nestjs/schedule";

@Controller({
    version: '1',
    path: '/application',
})
export class ApplicationController {

    constructor(private readonly paginationService: PaginationService,
                private readonly applicationService: ApplicationService,
                private readonly authApiService: AuthApiService,
                private readonly taskScheduleService: ScheduleService,
                private readonly httpService: HttpService,
                private schedulerRegistry: SchedulerRegistry
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

    @Response('schedule.create')
    @UserProfileGuard()
    @AuthAdminJwtGuard()
    @Post('/schedule')
    async scheduleNotification(@Body() dto: TaskScheduleDto, @GetUser() user: IUserDocument) {
        const job = this.schedulerRegistry.getCronJob('notifications');
        if (job.running !== true) {
            job.start();
            console.log('notifications corn job started');
        }
        return this.taskScheduleService.create(dto, dto.name, user);

    }

    @ResponsePaging('schedule.list')
    @UserProfileGuard()
    @AuthAdminJwtGuard()
    @Get('/schedule/list')
    async getScheduledList(@GetUser() user: IUserDocument) {
        const find: Record<string, any> = {
            owner: user._id,
        };
        const tasks: TaskScheduleDocument[] = await this.taskScheduleService.findAll<TaskScheduleDocument>(find);
        const ojb = [];

        for (const t of tasks) {
            const o = {
                id: t._id,
                name: t.name,
                schedule: t.schedule,
                createdAt: t['createdAt'],
                updatedAt: t['updatedAt'],
                applications: JSON.parse(t.task),
            };
            ojb.push(o);
        }

        return {
            data: ojb
        };
    }

    @Response('schedule.delete')
    @TaskScheduleGetGuard()
    @RequestParamGuard(TaskScheduleRequestDto)
    @AuthAdminJwtGuard()
    @Delete('/schedule/delete/:task')
    async scheduledDelete(@GetTaskSchedule() task: TaskScheduleDocument) {
        return this.taskScheduleService.deleteOne({_id: task._id});
    }


    @Cron(CronExpression.EVERY_MINUTE, {
        name: "notifications"
    })
    async handleCron() {
        console.log({date: new Date()});
        const gt = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes());
        const lt = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes() + 1);
        const find: Record<string, any> = {
            schedule: {
                '$gte': (gt),
                '$lte': (lt),
            },
        };


        const tasks: TaskScheduleDocument[] = await this.taskScheduleService.findAll<TaskScheduleDocument>(find);


        for (const v of tasks) {
            const applications = JSON.parse(v.task);
            console.log({applications});
            if (Array.isArray(applications)) {
                for (const app of applications) {
                    console.log({app});
                    const id: string = app['app_id'];
                    console.log({id});
                    const appl: ApplicationDocument = await this.applicationService.findOne({application_id: id});
                    if (appl) {

                        delete app.app_name;
                        const config = {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Basic ${appl.basic_auth_key}`
                            },
                        };
                        console.log({config});
                        try {
                            const req = this.httpService.post("https://onesignal.com/api/v1/notifications", JSON.stringify(app), config,);
                            const res = await req.toPromise();
                            console.log(res);
                            console.log(res.data);
                            console.log(res.headers);
                            console.log({v});
                            await this.taskScheduleService.deleteOne({_id: v._id});

                        } catch (e) {
                            console.log({error: 'error occurred'});
                            console.log({e});

                        }

                    }


                }
            }

        }


        const count = await this.taskScheduleService.getTotal({});
        console.log({count});

        if (count === 0) {
            const job = this.schedulerRegistry.getCronJob('notifications');
            job.stop();
            console.log('notifications corn job stopped');
        }


        return tasks;
    }

}
