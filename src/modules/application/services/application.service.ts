import {ConflictException, Injectable} from "@nestjs/common";
import {DatabaseEntity} from "../../../common/database/decorators/database.decorator";
import {Model} from "mongoose";
import {ApplicationDocument, ApplicationEntity} from "../schemas/application.schema";
import {CreateApplicationDto} from "../dtos/create.application.dto";
import {IUserDocument} from "../../user/user.interface";
import {IDatabaseFindAllOptions, IDatabaseFindOneOptions} from "../../../common/database/database.interface";
import {AppGroupEntity} from "../../group/schemas/app-groups.schema";
import {ApplicationUpdateDto} from "../dtos/update.application.dto";
import {IApplicationDocument} from "../application.interface";
import {MongoError} from 'mongodb';
import {ENUM_APPLICATION_STATUS_CODE_ERROR} from "../constant/application.status-code.enum";

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

            await create.save();
            return create['_doc'];

        } catch (error) {
            if ((error as MongoError).code === 11000) {

                throw new ConflictException({
                    statusCode: ENUM_APPLICATION_STATUS_CODE_ERROR.APPLICATION_EXIST_ERROR,
                    message: 'application.error.exist',
                });
            }
            throw error;
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

    async deleteOne<T>(find: Record<string, any>): Promise<T> {
        return this.applicationModel.findOneAndDelete(find).lean();
    }


    async update(
        _id: string,
        {name, players, message_able_players, gcm_key, groups}: ApplicationUpdateDto
    ): Promise<IApplicationDocument> {

        const body = {
            name,
            players,
            message_able_players, gcm_key,

        };

        let update = {};
        if (groups) {
            update = {
                ...body,
                $addToSet: {groups: {$each: [...groups]}},
            };
        } else {
            update = body;
        }


        await this.applicationModel.findByIdAndUpdate<IApplicationDocument>({_id}, update);
        return this.findOneById<IApplicationDocument>(_id);
    }

    async removeGroup(
        _id: string,
        {groups}: ApplicationUpdateDto
    ): Promise<IApplicationDocument> {


        if (groups) {
            const update = {
                $pullAll: {groups: [...groups]},
            };
            await this.applicationModel.findByIdAndUpdate<IApplicationDocument>({_id}, update);
        }


        return this.findOneById<IApplicationDocument>(_id);
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