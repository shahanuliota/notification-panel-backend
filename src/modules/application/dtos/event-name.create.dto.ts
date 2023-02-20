import {IsIn, IsNotEmpty, IsString} from "class-validator";
import {acceptedEvents} from "../constant/match-event.constant";

export class EventNameCreateDto {

    @IsString()
    @IsNotEmpty()
    @IsIn(acceptedEvents)
    name: string;


    @IsString()
    @IsNotEmpty()
    message: string;
    @IsString()
    @IsNotEmpty()
    header: string;
}
