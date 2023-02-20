import {IsArray, IsIn, IsJSON, IsMongoId, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {acceptedEvents} from "../constant/match-event.constant";

export class LiveMatchEventCreateDto {
    @IsMongoId({each: true})
    // @ArrayNotEmpty()
    @IsArray()
    @IsNotEmpty()
    readonly applications: string[];

    @IsString()
    @IsNotEmpty()
    readonly name: string;


    // @ArrayNotEmpty()
    @IsArray()
    @IsNotEmpty()
    @IsString({each: true})
    @IsIn(acceptedEvents, {each: true})
    readonly events: string[];

    @IsString()
    @IsNotEmpty()
    readonly matchId: string;

    @IsString()
    @IsJSON()
    teamA: string;

    @IsString()
    @IsJSON()
    teamB: string;


    @IsNumber()
    startTime: number;
}
