import {Injectable} from "@nestjs/common";
import {DatabaseEntity} from "../../../common/database/decorators/database.decorator";
import {Model} from "mongoose";
import {ApplicationDocument, ApplicationEntity} from "../schemas/application.schema";
import {CreateApplicationDto} from "../dtos/create.application.dto";
import {IUserDocument} from "../../user/user.interface";

@Injectable()
export class ApplicationService {
    constructor(
        @DatabaseEntity(ApplicationEntity.name)
        private readonly applicationModel: Model<ApplicationDocument>
    ) {
    }

    async create(data: CreateApplicationDto, user: IUserDocument): Promise<ApplicationDocument> {
        try {
            const create: ApplicationDocument = new this.applicationModel({
                name: data.name,
                isActive: true,
                owner: user._id,
                players: data.players,
                message_able_players: data.message_able_players,
                basic_auth_key: data.basic_auth_key,
                application_id: data.application_id,
                //    gcm_key: data.gcm_key,

            });

            return create.save();
        } catch (e) {

            console.log(e);
            throw e;
        }
    }


}