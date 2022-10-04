import {applyDecorators, UseGuards} from "@nestjs/common";
import {GroupPutToRequestGuard} from "../guards/group.put-to-request.guard";
import {GroupNotFoundGuard} from "../guards/group.not-found.guard";
import {GroupActiveGuard} from "../guards/group.active.guard";

export function GroupDeleteGuard(): any {
    return applyDecorators(
        UseGuards(GroupPutToRequestGuard, GroupNotFoundGuard, GroupActiveGuard),
    );
}