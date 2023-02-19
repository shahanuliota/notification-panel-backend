import {applyDecorators, UseGuards} from "@nestjs/common";
import {EventNamePutToRequestGuard} from "../guards/event-name.put-to-request.guards";
import {EventNameNotFoundGuards} from "../guards/event-name.not-found.guards";

export function EventNameGetGuard(): any {
    return applyDecorators(UseGuards(EventNamePutToRequestGuard, EventNameNotFoundGuards));
}
