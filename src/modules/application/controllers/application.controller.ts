import {Body, Controller, Get, Post} from "@nestjs/common";
import {CreateApplicationDto} from "../dtos/create.application.dto";
import {PaginationService} from "../../../common/pagination/services/pagination.service";
import {ApplicationService} from "../services/application.service";
import {UserProfileGuard} from "../../user/decorators/user.public.decorator";
import {AuthJwtGuard} from "../../../common/auth/decorators/auth.jwt.decorator";
import {ENUM_AUTH_PERMISSIONS} from "../../../common/auth/constants/auth.enum.permission.constant";
import {GetUser} from "../../user/decorators/user.decorator";
import {IUserDocument} from "../../user/user.interface";
import {IResponse} from "../../../common/response/response.interface";
import {ApplicationDocument} from "../schemas/application.schema";
import {Response} from "../../../common/response/decorators/response.decorator";
import {ApplicationGetSerialization} from "../serialization/application.get.serialization";

@Controller({
    version: '1',
    path: '/application',
})
export class ApplicationController {

    constructor(private readonly paginationService: PaginationService,
                private readonly applicationService: ApplicationService) {
    }

    @Get('/hello')
    async hello() {
        return "hello masud";
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

        // return {
        //     name: data.name,
        //     owner: data.owner,
        //     isActive: data.isActive,
        //     players: data.players,
        //     message_able_players: data.message_able_players,
        //     basic_auth_key: data.basic_auth_key,
        //     application_id: data.application_id,
        //     gcm_key: data.gcm_key,
        //     _id: data._id,
        // };

        console.log({data1});

        return {...data1["_doc"]};
    }

}