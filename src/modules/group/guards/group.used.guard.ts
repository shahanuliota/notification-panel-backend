import {CanActivate, ExecutionContext, ForbiddenException, Injectable} from "@nestjs/common";
import {ApplicationService} from "../../application/services/application.service";
import {ApplicationDocument} from "../../application/schemas/application.schema";
import {ENUM_GROUP_STATUS_CODE_ERROR} from "../constant/group.status-code.constant";

@Injectable()
export class GroupUsedGuard implements CanActivate {
    constructor(private readonly applicationService: ApplicationService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const {__group} = context.switchToHttp().getRequest();


        const query = {
            'groups': __group._id,

        };
       

        const check: ApplicationDocument = await this.applicationService.findOne(query);


        if (check) {
            throw new ForbiddenException({
                statusCode: ENUM_GROUP_STATUS_CODE_ERROR.GROUP_USED_ERROR,
                message: 'group.error.used',
            });
        }
        return true;
    }
}