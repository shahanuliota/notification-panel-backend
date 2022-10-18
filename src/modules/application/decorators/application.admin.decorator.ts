import {applyDecorators, UseGuards} from "@nestjs/common";
import {ApplicationPutToRequestGuard} from "../guards/application.put-to-request.guards";
import {ApplicationNotFoundGuard} from "../guards/application.not-found.guard";

export function ApplicationGetGuard(): any {
    return applyDecorators(UseGuards(ApplicationPutToRequestGuard, ApplicationNotFoundGuard));
}