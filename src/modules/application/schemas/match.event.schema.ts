import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserEntity } from '../../user/schemas/user.schema';
import { ApplicationEntity } from './application.schema';
import { EventNameEntity } from './event-name.schema';

@Schema({ timestamps: true, versionKey: false })
export class MatchEventEntity {
    @Prop({
        required: true,
        uppercase: true,
        trim: true,
    })
    name: string;

    @Prop({
        required: true,
        unique: true,
    })
    matchId: string;
    @Prop({
        required: false,
        type: Array,
        ref: EventNameEntity.name,
        default: [],
    })
    events: Types.ObjectId[];

    @Prop({
        required: false,
        type: Array,
        ref: ApplicationEntity.name,
        default: [],
    })
    applications: Types.ObjectId[];

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: UserEntity.name,
    })
    owner: Types.ObjectId;

    @Prop({
        required: true,
    })
    startTime: number;

    @Prop({
        required: true,
    })
    teamA: string;
    @Prop({
        required: true,
    })
    @Prop({
        required: false,
        type: Date,
    })
    schedule?: Date;
    @Prop({
        required: false,
        type: Date,
    })
    scheduleForInterVal?: Date;

    @Prop({
        required: true,
    })
    teamB: string;
}

export const MatchEventDatabaseName = 'live_match_event';
export const MatchEventSchema = SchemaFactory.createForClass(MatchEventEntity);

export type MatchEventDocument = MatchEventEntity & Document;

// Hooks
MatchEventSchema.pre<MatchEventDocument>('save', function (next) {
    next();
});
