import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {UserEntity} from "../../user/schemas/user.schema";

@Schema({timestamps: true, versionKey: false})
export class TaskScheduleEntity {
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
        type: Date

    })
    schedule: Date;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: UserEntity.name,
    })
    owner: Types.ObjectId;
}

export const TaskScheduleDatabaseName = 'task_schedule';
export const TaskScheduleSchema = SchemaFactory.createForClass(TaskScheduleEntity);

export type TaskScheduleDocument = TaskScheduleEntity & Document;

// Hooks
TaskScheduleSchema.pre<TaskScheduleDocument>('save', function (next) {
    next();
});
