import {Type} from 'class-transformer';
import {IsEmail, IsMongoId, IsNotEmpty, IsString, MaxLength, MinLength,} from 'class-validator';
import {IsPasswordStrong} from 'src/common/request/validations/request.is-password-strong.validation';
import {IsStartWith} from 'src/common/request/validations/request.is-start-with.validation';

export class UserCreateDto {
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    @Type(() => String)
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(30)
    @Type(() => String)
    readonly firstName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(30)
    @Type(() => String)
    readonly lastName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(14)
    @Type(() => String)
    @IsStartWith(['01'])
    readonly mobileNumber: string;

    @IsNotEmpty()
    @IsMongoId()
    readonly role: string;

    @IsNotEmpty()
    @IsPasswordStrong()
    readonly password: string;

    @IsNotEmpty()
    readonly userAuthKey: string;
    @IsNotEmpty()
    readonly apiToken: string;
}
