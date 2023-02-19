import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {EventNameDocument} from "../schemas/event-name.schema";

export const GetEventName = createParamDecorator(
    (data: string, ctx: ExecutionContext): EventNameDocument => {
        const {__event_name} = ctx.switchToHttp().getRequest();
        return __event_name;
    }
);
