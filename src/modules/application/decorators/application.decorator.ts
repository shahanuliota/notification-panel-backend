import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {IApplicationDocument} from "../application.interface";

export const GetApplication = createParamDecorator(
    (data: string, ctx: ExecutionContext): IApplicationDocument => {
        const {__application} = ctx.switchToHttp().getRequest();
        return __application;
    }
);