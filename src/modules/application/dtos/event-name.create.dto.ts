import {IsIn, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {acceptedEvents} from "../constant/match-event.constant";

export class EventNameCreateDto {

    @IsString()
    @IsNotEmpty()
    @IsIn(acceptedEvents)
    name: string;


    @IsString()
    @IsOptional()
    message: string;
    @IsString()
    @IsNotEmpty()
    header: string;
}
