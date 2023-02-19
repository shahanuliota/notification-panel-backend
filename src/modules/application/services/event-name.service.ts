import {ConflictException, Injectable} from "@nestjs/common";
import {DatabaseEntity} from "../../../common/database/decorators/database.decorator";
import {Model} from "mongoose";
import {EventNameDocument, EventNameEntity} from "../schemas/event-name.schema";
import {IUserDocument} from "../../user/user.interface";
import {MongoError} from "mongodb";
import {ENUM_APPLICATION_STATUS_CODE_ERROR} from "../constant/application.status-code.enum";
import {EventNameCreateDto} from "../dtos/event-name.create.dto";
import {IDatabaseFindAllOptions} from "../../../common/database/database.interface";

@Injectable()
export class EventNameService {
    constructor(@DatabaseEntity(EventNameEntity.name)
                private readonly eventNameModel: Model<EventNameDocument>) {
    }


    async create(data: EventNameCreateDto, user: IUserDocument): Promise<EventNameDocument> {
        try {
            const create: EventNameDocument = new this.eventNameModel<EventNameEntity>({
                name: data.name,
                message: data.message,
                owner: user._id,
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
        const findAll = this.eventNameModel.find(find);
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

    async deleteOne<T>(find: Record<string, any>): Promise<T> {
        return this.eventNameModel.findOneAndDelete(find).lean();
    }

    async findOneById<T>(_id: string): Promise<T> {
        const applications = this.eventNameModel.findById(_id);
        return applications.lean();
    }
}
