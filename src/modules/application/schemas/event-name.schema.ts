import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {UserEntity} from "../../user/schemas/user.schema";

@Schema({timestamps: true, versionKey: false})
export class EventNameEntity {
    @Prop({
        required: true,
        trim: true,

    })
    name: string;
    @Prop({
        required: true,

        trim: true,

    })
    message: string;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: UserEntity.name,
    })
    owner: Types.ObjectId;
}

export const EventNameDatabaseName = 'event_name';
export const EventNameSchema = SchemaFactory.createForClass(EventNameEntity);

export type EventNameDocument = EventNameEntity & Document;

// Hooks
EventNameSchema.pre<EventNameDocument>('save', function (next) {
    next();
});
