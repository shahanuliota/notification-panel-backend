import {CanActivate, ExecutionContext, Injectable, NotFoundException} from "@nestjs/common";
import {ENUM_APPLICATION_STATUS_CODE_ERROR} from "../constant/application.status-code.enum";

@Injectable()
export class TaskScheduleNotFoundGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const {__task} = context.switchToHttp().getRequest();

        if (!__task) {
            throw new NotFoundException({
                statusCode: ENUM_APPLICATION_STATUS_CODE_ERROR.APPLICATION_NOT_FOUND_ERROR,
                message: 'schedule.error.notFound',
            });
        }

        return true;
    }
}
