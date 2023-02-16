import {Body, Controller, Get, Post} from "@nestjs/common";
import {GetUser} from "../../user/decorators/user.decorator";
import {IUserDocument} from "../../user/user.interface";
import {UserProfileGuard} from "../../user/decorators/user.public.decorator";
import {PaginationService} from "../../../common/pagination/services/pagination.service";
import {ApplicationService} from "../services/application.service";
import {AuthApiService} from "../../../common/auth/services/auth.api.service";
import {HttpService} from "@nestjs/axios";
import {LiveMatchEventService} from "../services/live.match.event.service";
import {Response, ResponsePaging} from "../../../common/response/decorators/response.decorator";
import {AuthAdminJwtGuard} from "../../../common/auth/decorators/auth.jwt.decorator";
import {MatchEventDocument} from "../schemas/match.event.schema";
import {LiveMatchEventCreateDto} from "../dtos/live_match_event.create.dto";

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
    saveMatch(@Body() dto: LiveMatchEventCreateDto, @GetUser() user: IUserDocument) {

        return this.liveMatchEventService.create(dto, dto.name, user);

    }

    @ResponsePaging('schedule.list')
    @UserProfileGuard()
    @AuthAdminJwtGuard()
    @Get('list')
    async getSavedLiveMach() {
        const list: MatchEventDocument[] = await this.liveMatchEventService.findAll<MatchEventDocument>({});
        return {data: list};
    }
}
