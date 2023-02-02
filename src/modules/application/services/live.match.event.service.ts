import {ConflictException, Injectable} from "@nestjs/common";
import {DatabaseEntity} from "../../../common/database/decorators/database.decorator";
import {Model} from "mongoose";
import {MatchEventDocument, MatchEventEntity} from "../schemas/match.event.schema";
import {TaskScheduleDto} from "../dtos/task.schedule.dto";
import {IUserDocument} from "../../user/user.interface";
import {MongoError} from "mongodb";
import {ENUM_APPLICATION_STATUS_CODE_ERROR} from "../constant/application.status-code.enum";

@Injectable()
export class LiveMatchEventService {
    constructor(
        @DatabaseEntity(MatchEventEntity.name)
        private readonly matchEventModel: Model<MatchEventDocument>
    ) {
    }

    async create(dto: TaskScheduleDto, name: string, user: IUserDocument): Promise<MatchEventDocument> {
        try {
            const create: MatchEventDocument = new this.matchEventModel({
                name: name,
                task: dto.applications,

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

}
