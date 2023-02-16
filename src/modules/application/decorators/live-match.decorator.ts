import {applyDecorators, UseGuards} from "@nestjs/common";
import {LiveMatchPutToRequestGuards} from "../guards/live_match.put-to-request.guards";
import {LiveMatchNotFoundGuard} from "../guards/live-match.not-found.guard";

export function LiveMatchGetGuard(): any {
    return applyDecorators(UseGuards(LiveMatchPutToRequestGuards, LiveMatchNotFoundGuard));
}
