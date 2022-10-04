import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {GroupService} from "../services/group.service";
import {AppGroupDocument} from "../schemas/app-groups.schema";

@Injectable()
export class GroupPutToRequestGuard implements CanActivate {
    constructor(private readonly groupService: GroupService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const {params} = request;
        const {group} = params;

        const check: AppGroupDocument =
            await this.groupService.findOneById(group);
        request.__group = check;

        return true;
    }
}