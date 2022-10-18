import {IsMongoId, IsNotEmpty} from "class-validator";
import {Type} from "class-transformer";

export class ApplicationRequestDto {
    @IsNotEmpty()
    @IsMongoId()
    @Type(() => String)
    application: string;
}
