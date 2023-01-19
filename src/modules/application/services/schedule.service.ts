import {DatabaseEntity} from "../../../common/database/decorators/database.decorator";
import {Model} from "mongoose";
import {TaskScheduleDocument, TaskScheduleEntity} from "../schemas/task_schedule.schema";
import {MongoError} from "mongodb";
import {ConflictException} from "@nestjs/common";
import {ENUM_APPLICATION_STATUS_CODE_ERROR} from "../constant/application.status-code.enum";
import {TaskScheduleDto} from "../dtos/task.schedule.dto";

export class ScheduleService {
    constructor(
        @DatabaseEntity(TaskScheduleEntity.name)
        private readonly taskScheduleModel: Model<TaskScheduleDocument>
    ) {
    }

    async create(dto: TaskScheduleDto, name: string): Promise<TaskScheduleDocument> {
        try {
            const create: TaskScheduleDocument = new this.taskScheduleModel({
                name: name,
                task: dto.applications,
                schedule: dto.scheduleDate,
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
}
