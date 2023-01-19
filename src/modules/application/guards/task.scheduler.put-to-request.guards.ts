import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {ScheduleService} from "../services/schedule.service";
import {TaskScheduleDocument} from "../schemas/task_schedule.schema";

@Injectable()
export class TaskSchedulerPutToRequestGuards implements CanActivate {
    constructor(private readonly taskSchedulerService: ScheduleService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const {params} = request;
        const {task} = params;

        const taskSchedule: TaskScheduleDocument =
            await this.taskSchedulerService.findOneById<TaskScheduleDocument>(task);
        request.__task = taskSchedule;

        return true;
    }
}
