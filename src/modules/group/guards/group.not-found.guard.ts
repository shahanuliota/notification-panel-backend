import {CanActivate, ExecutionContext, Injectable, NotFoundException} from "@nestjs/common";
import {ENUM_GROUP_STATUS_CODE_ERROR} from "../constant/group.status-code.constant";

@Injectable()
export class GroupNotFoundGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const {__group} = context.switchToHttp().getRequest();

        if (!__group) {
            throw new NotFoundException({
                statusCode: ENUM_GROUP_STATUS_CODE_ERROR.GROUP_NOT_FOUND_ERROR,
                message: 'group.error.notFound',
            });
        }

        return true;
    }
}