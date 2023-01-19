import {IsDate, IsJSON, IsString} from "class-validator";
import {Type} from "class-transformer";

export class TaskScheduleDto {


    @IsString()
    @IsJSON()
    applications: string;

    @IsDate()
    @Type(() => Date)
    scheduleDate: Date;
}