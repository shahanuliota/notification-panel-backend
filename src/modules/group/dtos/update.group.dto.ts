import {PickType} from '@nestjs/mapped-types';
import {GroupCreateDto} from "./create.group.dto";

export class GroupUpdateDto extends PickType(GroupCreateDto, [
    'name',
    'description',
] as const) {
}
