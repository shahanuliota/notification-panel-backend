import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {AppGroupDocument} from "../schemas/app-groups.schema";

export const GetGroup = createParamDecorator(
    (data: string, ctx: ExecutionContext): AppGroupDocument => {
        const {__group} = ctx.switchToHttp().getRequest();
        return __group;
    }
);
