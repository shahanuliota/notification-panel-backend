import {ExecutionContext, Injectable} from "@nestjs/common";
import {LiveMatchEventService} from "../services/live.match.event.service";
import {MatchEventDocument} from "../schemas/match.event.schema";

@Injectable()
export class LiveMatchPutToRequestGuards {
    constructor(private readonly taskSchedulerService: LiveMatchEventService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const {params} = request;
        const {id} = params;

        const liveMatch: MatchEventDocument =
            await this.taskSchedulerService.findOneById<MatchEventDocument>(id);
        request.__liveMatch = liveMatch;
        return true;
    }
}
