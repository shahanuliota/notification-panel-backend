import {DatabaseEntity} from "../../../common/database/decorators/database.decorator";
import {Model} from "mongoose";
import {TaskScheduleDocument, TaskScheduleEntity} from "../schemas/task_schedule.schema";
import {MongoError} from "mongodb";
import {ConflictException, Injectable} from "@nestjs/common";
import {ENUM_APPLICATION_STATUS_CODE_ERROR} from "../constant/application.status-code.enum";
import {TaskScheduleDto} from "../dtos/task.schedule.dto";
import {IDatabaseFindAllOptions} from "../../../common/database/database.interface";
import {IUserDocument} from "../../user/user.interface";

@Injectable()
export class ScheduleService {
    constructor(
        @DatabaseEntity(TaskScheduleEntity.name)
        private readonly taskScheduleModel: Model<TaskScheduleDocument>
    ) {
    }

    async create(dto: TaskScheduleDto, name: string, user: IUserDocument): Promise<TaskScheduleDocument> {
        try {
            const create: TaskScheduleDocument = new this.taskScheduleModel({
                name: name,
                task: dto.applications,
                schedule: dto.scheduleDate,
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

    async deleteOne<T>(find: Record<string, any>): Promise<T> {
        return this.taskScheduleModel.findOneAndDelete(find).lean();
    }

    async findOne(find?: Record<string, any>): Promise<TaskScheduleDocument> {
        return this.taskScheduleModel.findOne(find).lean();
    }

    async getTotal(find?: Record<string, any>): Promise<number> {
        return this.taskScheduleModel.countDocuments(find);
    }

    async findOneById<T>(_id: string): Promise<T> {
        const applications = this.taskScheduleModel.findById(_id);
        return applications.lean();
    }

    async findAll<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]> {
        const findAll = this.taskScheduleModel.find(find);
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
}
