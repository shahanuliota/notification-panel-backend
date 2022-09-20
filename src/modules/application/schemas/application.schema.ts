import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {UserEntity} from "../../user/schemas/user.schema";

@Schema({timestamps: true, versionKey: false})
export class ApplicationEntity {
    @Prop({
        required: true,
        uppercase: true,
        trim: true,

    })
    name: string;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: UserEntity.name,
    })
    owner: Types.ObjectId;

    @Prop({
        required: true,
        default: true,
    })
    isActive: boolean;

    @Prop({
        required: true,
        default: 0
    })
    players: number;

    @Prop({
        required: true,
        default: 0
    })
    message_able_players: number;

    @Prop({
        required: true,

    })
    basic_auth_key: string;

    @Prop({
        required: true,
        unique: true,
    })
    application_id: string;

    @Prop({
        default: ""
    })
    gcm_key: string;
}

export const ApplicationDatabaseName = 'applications';
export const ApplicationSchema = SchemaFactory.createForClass(ApplicationEntity);

export type ApplicationDocument = ApplicationEntity & Document;

// Hooks
ApplicationSchema.pre<ApplicationDocument>('save', function (next) {
    next();
});
