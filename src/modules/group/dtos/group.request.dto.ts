import {IsMongoId, IsNotEmpty} from "class-validator";
import {Type} from "class-transformer";

export class GroupRequestDto {
    @IsNotEmpty()
    @IsMongoId()
    @Type(() => String)
    group: string;
}