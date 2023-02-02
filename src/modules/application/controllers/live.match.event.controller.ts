import {Body, Controller, Post} from "@nestjs/common";
import {TaskScheduleDto} from "../dtos/task.schedule.dto";
import {GetUser} from "../../user/decorators/user.decorator";
import {IUserDocument} from "../../user/user.interface";
import {UserProfileGuard} from "../../user/decorators/user.public.decorator";
import {PaginationService} from "../../../common/pagination/services/pagination.service";
import {ApplicationService} from "../services/application.service";
import {AuthApiService} from "../../../common/auth/services/auth.api.service";
import {HttpService} from "@nestjs/axios";
import {LiveMatchEventService} from "../services/live.match.event.service";
import {Response} from "../../../common/response/decorators/response.decorator";
import {AuthAdminJwtGuard} from "../../../common/auth/decorators/auth.jwt.decorator";

@Controller({
    version: '1',
    path: '/live-match',
})
export class LiveMatchEventController {

    constructor(private readonly paginationService: PaginationService,
                private readonly applicationService: ApplicationService,
                private readonly authApiService: AuthApiService,
                private readonly liveMatchEventService: LiveMatchEventService,
                private readonly httpService: HttpService
    ) {
    }

    @Response('schedule.create')
    @UserProfileGuard()
    @AuthAdminJwtGuard()
    @Post(
        'add'
    )
    saveMatch(@Body() dto: TaskScheduleDto, @GetUser() user: IUserDocument) {

        return this.liveMatchEventService.create(dto, dto.name, user);

    }

}
