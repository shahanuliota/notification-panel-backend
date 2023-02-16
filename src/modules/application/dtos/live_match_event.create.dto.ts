import {IsArray, IsJSON, IsMongoId, IsNotEmpty, IsNumber, IsString} from "class-validator";

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
