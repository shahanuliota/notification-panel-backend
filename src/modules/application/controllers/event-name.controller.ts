import {Body, Controller, Delete, Get, Post} from "@nestjs/common";
import {Response, ResponsePaging} from "../../../common/response/decorators/response.decorator";
import {UserProfileGuard} from "../../user/decorators/user.public.decorator";
import {AuthAdminJwtGuard} from "../../../common/auth/decorators/auth.jwt.decorator";
import {GetUser} from "../../user/decorators/user.decorator";
import {IUserDocument} from "../../user/user.interface";
import {EventNameCreateDto} from "../dtos/event-name.create.dto";
import {EventNameService} from "../services/event-name.service";
import {MatchEventDocument} from "../schemas/match.event.schema";
import {RequestParamGuard} from "../../../common/request/decorators/request.decorator";
import {OnlyIDParamDTO} from "../dtos/only.id.params.dto";
import {ENUM_AUTH_PERMISSIONS} from "../../../common/auth/constants/auth.enum.permission.constant";
import {EventNameGetGuard} from "../decorators/event-name.decorator";
import {GetEventName} from "../decorators/event-name.get.decorator";
import {EventNameDocument} from "../schemas/event-name.schema";

@Controller({
    version: '1',
    path: '/event-name',
})
export class EventNameController {

    constructor(private eventNameService: EventNameService) {
    }


    @Response('schedule.create')
    @UserProfileGuard()
    @AuthAdminJwtGuard()
    @Post(
        'add'
    )
    async createEventName(@GetUser() user: IUserDocument, @Body() body: EventNameCreateDto) {
        return await this.eventNameService.create(body, user);
    }

    @ResponsePaging('schedule.list')
    @UserProfileGuard()
    @AuthAdminJwtGuard()
    @Get('list')
    async getSavedLiveMach(@GetUser() user: IUserDocument,) {
        const find = {
            owner: user._id
        };
        const list: MatchEventDocument[] = await this.eventNameService.findAll<MatchEventDocument>(find);
        return {data: list};
    }


    @Response('application.get')
    @EventNameGetGuard()
    @RequestParamGuard(OnlyIDParamDTO)
    @AuthAdminJwtGuard(ENUM_AUTH_PERMISSIONS.APPLICATION_READ)
    @Delete('delete/:id')
    async deleteMatch(@GetEventName() event: EventNameDocument) {
        return await this.eventNameService.deleteOne({_id: event._id});
    }
}
