import {PickType} from "@nestjs/mapped-types";
import {CreateApplicationDto} from "./create.application.dto";

export class ApplicationUpdateDto extends PickType(CreateApplicationDto, [
    'name',
    'gcm_key',
    'basic_auth_key',
    'message_able_players',
    'players',
] as const) {
}
