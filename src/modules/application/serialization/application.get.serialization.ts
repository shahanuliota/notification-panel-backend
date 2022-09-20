import {Exclude, Type} from 'class-transformer';

export class ApplicationGetSerialization {
    @Type(() => String)
    readonly _id: string;

    readonly isActive: boolean;
 
    readonly name: string;
    readonly createdAt: Date;
    readonly players: number;
    readonly message_able_players: number;
    readonly basic_auth_key: string;
    readonly application_id: string;
    readonly gcm_key: string;

    @Exclude()
    readonly updatedAt: Date;
}
