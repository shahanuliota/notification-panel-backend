import {IsBoolean, IsNotEmpty, IsString, ValidateIf} from 'class-validator';

export class GroupCreateDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;


    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsBoolean()
    @IsNotEmpty()
    @ValidateIf((e) => e.isActive !== '')
    readonly isActive?: boolean;
}
