import {ExecutionContext, NotFoundException} from "@nestjs/common";
import {ENUM_APPLICATION_STATUS_CODE_ERROR} from "../constant/application.status-code.enum";

export class LiveMatchNotFoundGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const {__liveMatch} = context.switchToHttp().getRequest();

        if (!__liveMatch) {
            throw new NotFoundException({
                statusCode: ENUM_APPLICATION_STATUS_CODE_ERROR.APPLICATION_NOT_FOUND_ERROR,
                message: 'schedule.error.notFound',
            });
        }

        return true;
    }
}
