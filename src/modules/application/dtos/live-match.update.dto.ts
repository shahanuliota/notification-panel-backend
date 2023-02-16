import {PickType} from "@nestjs/mapped-types";
import {LiveMatchEventCreateDto} from "./live_match_event.create.dto";

export class LiveMatchUpdateDto extends PickType(LiveMatchEventCreateDto, [
    'applications',
    'events',

] as const) {
}
