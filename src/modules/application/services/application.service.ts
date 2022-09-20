import {Injectable} from "@nestjs/common";
import {DatabaseEntity} from "../../../common/database/decorators/database.decorator";
import {Model} from "mongoose";
import {ApplicationDocument, ApplicationEntity} from "../schemas/application.schema";

@Injectable()
export class ApplicationService {
    constructor(
        @DatabaseEntity(ApplicationEntity.name)
        private readonly applicationModel: Model<ApplicationDocument>
    ) {
    }

    // async create(data: GroupCreateDto, user: IUserDocument): Promise<ApplicationDocument> {
    //     try {
    //         const create: ApplicationDocument = new this.applicationModel({});
    //
    //         return create.save();
    //     } catch (e) {
    //
    //         console.log(e);
    //         throw e;
    //     }
    // }


}