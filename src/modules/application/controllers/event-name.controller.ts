import {Body, Controller, Get, Post} from "@nestjs/common";
import {Response, ResponsePaging} from "../../../common/response/decorators/response.decorator";
import {UserProfileGuard} from "../../user/decorators/user.public.decorator";
import {AuthAdminJwtGuard} from "../../../common/auth/decorators/auth.jwt.decorator";
import {GetUser} from "../../user/decorators/user.decorator";
import {IUserDocument} from "../../user/user.interface";
import {EventNameCreateDto} from "../dtos/event-name.create.dto";
import {EventNameService} from "../services/event-name.service";
import {MatchEventDocument} from "../schemas/match.event.schema";

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
    async getSavedLiveMach() {
        const list: MatchEventDocument[] = await this.eventNameService.findAll<MatchEventDocument>({});
        return {data: list};
    }
}
