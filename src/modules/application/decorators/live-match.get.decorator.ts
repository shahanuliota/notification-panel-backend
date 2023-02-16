import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {TaskScheduleDocument} from "../schemas/task_schedule.schema";

export const GetLiveMatch = createParamDecorator(
    (data: string, ctx: ExecutionContext): TaskScheduleDocument => {
        const {__liveMatch} = ctx.switchToHttp().getRequest();
        return __liveMatch;
    }
);
