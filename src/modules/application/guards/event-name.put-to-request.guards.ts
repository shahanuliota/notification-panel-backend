import {ExecutionContext, Injectable} from "@nestjs/common";
import {EventNameService} from "../services/event-name.service";
import {EventNameDocument} from "../schemas/event-name.schema";

@Injectable()
export class EventNamePutToRequestGuard {
    constructor(private readonly eventNameService: EventNameService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const {params} = request;
        const {id} = params;

        const eventName: EventNameDocument =
            await this.eventNameService.findOneById<EventNameDocument>(id);
        request.__event_name = eventName;
        return true;
    }
}
