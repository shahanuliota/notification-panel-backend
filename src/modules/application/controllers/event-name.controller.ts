import {Body, Controller, Post} from "@nestjs/common";
import {Response} from "../../../common/response/decorators/response.decorator";
import {UserProfileGuard} from "../../user/decorators/user.public.decorator";
import {AuthAdminJwtGuard} from "../../../common/auth/decorators/auth.jwt.decorator";
import {GetUser} from "../../user/decorators/user.decorator";
import {IUserDocument} from "../../user/user.interface";
import {EventNameCreateDto} from "../dtos/event-name.create.dto";

@Controller({
    version: '1',
    path: '/event-name',
})
export class EventNameController {


    @Response('schedule.create')
    @UserProfileGuard()
    @AuthAdminJwtGuard()
    @Post(
        'add'
    )
    async createEventName(@GetUser() user: IUserDocument, @Body() body: EventNameCreateDto) {
        return body;
    }
}
