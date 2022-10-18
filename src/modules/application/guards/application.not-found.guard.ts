import {CanActivate, ExecutionContext, Injectable, NotFoundException} from "@nestjs/common";
import {ENUM_APPLICATION_STATUS_CODE_ERROR} from "../constant/application.status-code.enum";

@Injectable()
export class ApplicationNotFoundGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const {__application} = context.switchToHttp().getRequest();

        if (!__application) {
            throw new NotFoundException({
                statusCode: ENUM_APPLICATION_STATUS_CODE_ERROR.APPLICATION_NOT_FOUND_ERROR,
                message: 'application.error.notFound',
            });
        }

        return true;
    }
}