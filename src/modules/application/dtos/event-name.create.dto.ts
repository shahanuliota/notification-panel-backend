import {IsIn, IsNotEmpty, IsString} from "class-validator";

export class EventNameCreateDto {

    @IsString()
    @IsNotEmpty()
    @IsIn(['toss', 'firstInnings', 'lastInnings'],)
    name: string;


    @IsString()
    @IsNotEmpty()
    message: string;
}
