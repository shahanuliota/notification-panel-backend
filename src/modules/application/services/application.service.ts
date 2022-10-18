import {Injectable} from "@nestjs/common";
import {DatabaseEntity} from "../../../common/database/decorators/database.decorator";
import {Model} from "mongoose";
import {ApplicationDocument, ApplicationEntity} from "../schemas/application.schema";
import {CreateApplicationDto} from "../dtos/create.application.dto";
import {IUserDocument} from "../../user/user.interface";
import {IDatabaseFindAllOptions, IDatabaseFindOneOptions} from "../../../common/database/database.interface";
import {AppGroupEntity} from "../../group/schemas/app-groups.schema";
import {ApplicationUpdateDto} from "../dtos/update.application.dto";

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
                groups: data.groups
            });

            return create.save();

        } catch (e) {
            console.log(e);
            throw e;
        }
    }


    async findAll<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]> {
        const findAll = this.applicationModel.find(find);
        if (
            options &&
            options.limit !== undefined &&
            options.skip !== undefined
        ) {
            findAll.limit(options.limit).skip(options.skip);
        }

        if (options && options.sort) {
            findAll.sort(options.sort);
        }
        return findAll.lean();
    }

    async findOneById<T>(_id: string, options?: IDatabaseFindOneOptions): Promise<T> {
        const applications = this.applicationModel.findById(_id);

        if (options && options.populate && options.populate.groups) {
            applications.populate({
                path: 'groups',
                model: AppGroupEntity.name,
            });
        }

        return applications.lean();
    }

    async findOne(find?: Record<string, any>): Promise<ApplicationDocument> {
        return this.applicationModel.findOne(find).lean();
    }

    async getTotal(find?: Record<string, any>): Promise<number> {
        return this.applicationModel.countDocuments(find);
    }

    async deleteOne(find: Record<string, any>): Promise<ApplicationDocument> {
        return this.applicationModel.findOneAndDelete(find);
    }


    async update(
        _id: string,
        {name, players, message_able_players, gcm_key}: ApplicationUpdateDto
    ): Promise<ApplicationDocument> {
        const application: ApplicationDocument = await this.applicationModel.findById(_id);
        application.name = name;
        application.players = players;
        application.message_able_players = message_able_players;
        application.gcm_key = gcm_key;

        return application.save();
    }

    async inactive(_id: string): Promise<ApplicationDocument> {
        const application: ApplicationDocument =
            await this.applicationModel.findById(_id);
        application.isActive = false;
        return application.save();
    }

    async active(_id: string): Promise<ApplicationDocument> {
        const application: ApplicationDocument =
            await this.applicationModel.findById(_id);

        application.isActive = true;
        return application.save();
    }


}