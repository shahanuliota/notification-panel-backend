import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {ApplicationService} from "../services/application.service";

@Injectable()
export class ApplicationPutToRequestGuard implements CanActivate {
    constructor(private readonly applicationService: ApplicationService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const {params} = request;
        const {application} = params;

        const app =
            await this.applicationService.findOneById(application, {
                populate: {
                    groups: true,
                },
            });
        request.__application = app;

        return true;
    }
}
