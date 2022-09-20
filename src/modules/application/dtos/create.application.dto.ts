import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform} from "class-transformer";

export class CreateApplicationDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly owner: string;

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
}