import {Exclude, Type} from 'class-transformer';

export class GroupGetSerialization {
    @Type(() => String)
    readonly _id: string;

    readonly isActive: boolean;
    readonly name: string;
    readonly description: string;
    readonly createdAt: Date;

    @Exclude()
    readonly updatedAt: Date;
}
