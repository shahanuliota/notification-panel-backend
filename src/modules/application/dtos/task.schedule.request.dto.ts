import {IsMongoId, IsNotEmpty} from "class-validator";
import {Type} from "class-transformer";

export class TaskScheduleRequestDto {
    @IsNotEmpty()
    @IsMongoId()
    @Type(() => String)
    task: string;
}
