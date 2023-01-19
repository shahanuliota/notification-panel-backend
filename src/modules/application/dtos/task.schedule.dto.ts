import {IsDate, IsJSON, IsString} from "class-validator";
import {Type} from "class-transformer";

export class TaskScheduleDto {


    @IsString()
    @IsJSON()
    applications: string;
    @IsString()
    name: string;

    @IsDate()
    @Type(() => Date)
    scheduleDate: Date;
}
