import {IsMongoId, IsNotEmpty, IsString} from "class-validator";

export class LiveMatchRequestDto {

    @IsMongoId()
    @IsString()
    @IsNotEmpty()
    readonly id: string;
}
