import {Body, Controller, Delete, Get, Post, Put} from "@nestjs/common";
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
import {OnlyIDParamDTO} from "../dtos/only.id.params.dto";
import {ENUM_AUTH_PERMISSIONS} from "../../../common/auth/constants/auth.enum.permission.constant";
import {LiveMatchGetGuard} from "../decorators/live-match.decorator";
import {RequestParamGuard} from "../../../common/request/decorators/request.decorator";
import {GetLiveMatch} from "../decorators/live-match.get.decorator";
import {LiveMatchUpdateDto} from "../dtos/live-match.update.dto";
import {Cron, CronExpression, SchedulerRegistry} from "@nestjs/schedule";

@Controller({
    version: '1',
    path: '/live-match',
})
export class LiveMatchEventController {

    constructor(private readonly paginationService: PaginationService,
                private readonly applicationService: ApplicationService,
                private readonly authApiService: AuthApiService,
                private readonly liveMatchEventService: LiveMatchEventService,
                private readonly httpService: HttpService,
                private schedulerRegistry: SchedulerRegistry
    ) {
    }

    @Response('schedule.create')
    @UserProfileGuard()
    @AuthAdminJwtGuard()
    @Post(
        'add'
    )
    saveMatch(@Body() dto: LiveMatchEventCreateDto, @GetUser() user: IUserDocument) {
        const job = this.schedulerRegistry.getCronJob('match-event');

        if (job.running !== true) {
            job.start();
            console.log('match-event corn job started');
        }
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

    @Response('application.get',)
    @LiveMatchGetGuard()
    @RequestParamGuard(OnlyIDParamDTO)
    @AuthAdminJwtGuard(ENUM_AUTH_PERMISSIONS.APPLICATION_READ)
    @Delete('delete/:id')
    async deleteMatch(@GetLiveMatch() match: MatchEventDocument) {
        return await this.liveMatchEventService.deleteOne({_id: match._id});
    }

    @Response('application.update')
    @LiveMatchGetGuard()
    @RequestParamGuard(OnlyIDParamDTO)
    @AuthAdminJwtGuard(
        ENUM_AUTH_PERMISSIONS.APPLICATION_READ,
        ENUM_AUTH_PERMISSIONS.APPLICATION_UPDATE
    )
    @Put('update/:id')
    async updateLiveMatch(@GetLiveMatch() match: MatchEventDocument, @Body() dto: LiveMatchUpdateDto) {
        return await this.liveMatchEventService.update(match._id, dto);
    }

    @Cron(CronExpression.EVERY_MINUTE, {
        name: "match-event"
    })
    async matchCornJob() {
        console.log({matchCornJob: new Date()});
        const gt = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes());
        const lt = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes() + 1);
        const find: Record<string, any> = {
            schedule: {
                '$gte': (gt),
                '$lte': (lt),
            },
        };
        // console.log({find});
        const list: MatchEventDocument[] = await this.liveMatchEventService.findAll<MatchEventDocument>(find);


        for (const v of list) {
            await this.liveMatchEventService.triggerEvents(v);
        }
        const remainingList: MatchEventDocument[] = await this.liveMatchEventService.findAll<MatchEventDocument>();
        if (remainingList.length == 0) {
            const job = this.schedulerRegistry.getCronJob('match-event');
            job.stop();
            console.log('match-event corn job stopped');
        }

        return;
    }


    @Get('test')
    async testCornJob() {

        const find = {
            matchId: 61011
        };
        const list: MatchEventDocument[] = await this.liveMatchEventService.findAll<MatchEventDocument>(find);
        for (const v of list) {
            await this.liveMatchEventService.triggerEvents(v);
        }
        return 'ok';

    }


}
