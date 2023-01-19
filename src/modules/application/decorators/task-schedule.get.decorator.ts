import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {TaskScheduleDocument} from "../schemas/task_schedule.schema";

export const GetTaskSchedule = createParamDecorator(
    (data: string, ctx: ExecutionContext): TaskScheduleDocument => {
        const {__task} = ctx.switchToHttp().getRequest();
        return __task;
    }
);
