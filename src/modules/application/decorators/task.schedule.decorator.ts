import {applyDecorators, UseGuards} from "@nestjs/common";
import {TaskSchedulerPutToRequestGuards} from "../guards/task.scheduler.put-to-request.guards";
import {TaskScheduleNotFoundGuard} from "../guards/task.schedule.not-found.guard";

export function TaskScheduleGetGuard(): any {
    return applyDecorators(UseGuards(TaskSchedulerPutToRequestGuards, TaskScheduleNotFoundGuard));
}
