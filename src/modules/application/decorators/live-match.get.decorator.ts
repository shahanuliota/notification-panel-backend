import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {MatchEventDocument} from "../schemas/match.event.schema";

export const GetLiveMatch = createParamDecorator(
    (data: string, ctx: ExecutionContext): MatchEventDocument => {
        const {__liveMatch} = ctx.switchToHttp().getRequest();
        return __liveMatch;
    }
);
