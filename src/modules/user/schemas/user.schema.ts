import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {IAwsS3} from 'src/common/aws/aws.interface';
import {RoleEntity} from 'src/modules/role/schemas/role.schema';

@Schema({timestamps: true, versionKey: false})
export class UserEntity {
    @Prop({
        required: true,
        index: true,
        lowercase: true,
        trim: true,
    })
    firstName: string;

    @Prop({
        required: true,
        index: true,
        lowercase: true,
        trim: true,
    })
    lastName: string;

    @Prop({
        required: true,
        index: true,
        unique: true,
        trim: true,
    })
    mobileNumber: string;

    @Prop({
        required: true,
        index: true,
        unique: true,
        lowercase: true,
        trim: true,
    })
    email: string;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: RoleEntity.name,
    })
    role: Types.ObjectId;

    @Prop({
        required: true,
    })
    password: string;

    @Prop({
        required: true,
    })
    passwordExpired: Date;

    @Prop({
        required: true,
    })
    salt: string;

    @Prop({
        required: true,
    })
    userAuthKey: string;
    @Prop({
        required: true,
        default: '',
    })
    apiToken: string;

    @Prop({
        required: true,
        default: true,
    })
    isActive: boolean;

    @Prop({
        required: false,
        _id: false,
        type: {
            path: String,
            pathWithFilename: String,
            filename: String,
            completedUrl: String,
            baseUrl: String,
            mime: String,
        },
    })
    photo?: IAwsS3;
}

export const UserDatabaseName = 'users';
export const UserSchema = SchemaFactory.createForClass(UserEntity);

export type UserDocument = UserEntity & Document;

// Hooks
UserSchema.pre<UserDocument>('save', function (next) {
    this.email = this.email.toLowerCase();
    this.firstName = this.firstName.toLowerCase();
    this.lastName = this.lastName.toLowerCase();

    next();
});
