import {BadRequestException, CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {GROUP_ACTIVE_META_KEY} from "../constant/group.constant";
import {ENUM_GROUP_STATUS_CODE_ERROR} from "../constant/group.status-code.constant";

@Injectable()
export class GroupActiveGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const required: boolean[] = this.reflector.getAllAndOverride<boolean[]>(
            GROUP_ACTIVE_META_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (!required) {
            return true;
        }

        const {__group} = context.switchToHttp().getRequest();

        if (!required.includes(__group.isActive)) {
            throw new BadRequestException({
                statusCode: ENUM_GROUP_STATUS_CODE_ERROR.GROUP_ACTIVE_ERROR,
                message: 'group.error.active',
            });
        }
        return true;
    }
}
