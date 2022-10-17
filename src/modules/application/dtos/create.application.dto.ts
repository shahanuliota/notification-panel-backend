import {ArrayNotEmpty, IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform} from "class-transformer";

export class CreateApplicationDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;


    @IsNotEmpty()
    @IsNumber()
    @Transform(({value}) => parseInt(value))
    readonly players: number;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({value}) => parseInt(value))
    readonly message_able_players: number;

    @IsString()
    @IsNotEmpty()
    readonly basic_auth_key: string;

    @IsString()
    @IsNotEmpty()
    readonly application_id: string;

    @IsString()
    @IsOptional()
    readonly gcm_key: string;

    @IsMongoId({each: true})
    @ArrayNotEmpty()
    @IsArray()
    @IsNotEmpty()
    readonly groups: string[];
}