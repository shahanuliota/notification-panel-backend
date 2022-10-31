import {IsNotEmpty} from "class-validator";
import {Type} from "class-transformer";

export class FileRequestDto {
    @IsNotEmpty()
    @Type(() => String)
    name: string;
}