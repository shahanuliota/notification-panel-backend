import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {UserEntity} from "../../user/schemas/user.schema";

@Schema({timestamps: true, versionKey: false})
export class MatchEventEntity {
    @Prop({
        required: true,
        uppercase: true,
        trim: true,

    })
    name: string;

    @Prop({
        required: true,

    })
    task: string;


    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: UserEntity.name,
    })
    owner: Types.ObjectId;
}

export const MatchEventDatabaseName = 'live_match_event';
export const MatchEventSchema = SchemaFactory.createForClass(MatchEventEntity);

export type MatchEventDocument = MatchEventEntity & Document;

// Hooks
MatchEventSchema.pre<MatchEventDocument>('save', function (next) {
    next();
});
