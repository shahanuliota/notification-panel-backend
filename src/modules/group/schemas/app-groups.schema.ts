import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {UserEntity} from "../../user/schemas/user.schema";

@Schema({timestamps: true, versionKey: false})
export class AppGroupEntity {
    @Prop({
        required: true,
        // index: true,
        uppercase: true,
        // unique: true,
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
    })
    description: string;

    @Prop({
        required: true,
        default: true,
    })
    isActive: boolean;
}

export const AppGroupDocumentDatabaseName = 'groups';
export const AppGroupSchema = SchemaFactory.createForClass(AppGroupEntity);

export type AppGroupDocument = AppGroupEntity & Document;

// Hooks
AppGroupSchema.pre<AppGroupDocument>('save', function (next) {
    // this.name = this.name.toLowerCase();

    next();
});
