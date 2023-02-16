import {ConflictException, Injectable} from "@nestjs/common";
import {DatabaseEntity} from "../../../common/database/decorators/database.decorator";
import {Model, Types} from "mongoose";
import {MatchEventDocument, MatchEventEntity} from "../schemas/match.event.schema";
import {IUserDocument} from "../../user/user.interface";
import {MongoError} from "mongodb";
import {ENUM_APPLICATION_STATUS_CODE_ERROR} from "../constant/application.status-code.enum";
import {IDatabaseFindAllOptions} from "../../../common/database/database.interface";
import {LiveMatchEventCreateDto} from "../dtos/live_match_event.create.dto";
import {LiveMatchUpdateDto} from "../dtos/live-match.update.dto";
import {IApplicationDocument} from "../application.interface";

@Injectable()
export class LiveMatchEventService {
    constructor(
        @DatabaseEntity(MatchEventEntity.name)
        private readonly matchEventModel: Model<MatchEventDocument>
    ) {
    }

    async create(dto: LiveMatchEventCreateDto, name: string, user: IUserDocument): Promise<MatchEventDocument> {
        try {
            const create: MatchEventDocument = new this.matchEventModel<MatchEventEntity>({
                name: name,
                matchId: dto.matchId,
                events: dto.events,
                applications: dto.applications.map((e) => new Types.ObjectId(e)),
                owner: user._id,
                teamA: dto.teamA,
                teamB: dto.teamB,
                startTime: dto.startTime,
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
        const findAll = this.matchEventModel.find(find);
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
        return this.matchEventModel.findOneAndDelete(find).lean();
    }

    async findOneById<T>(_id: string): Promise<T> {
        const applications = this.matchEventModel.findById(_id);
        return applications.lean();
    }

    async update(
        _id: string,
        {applications, events}: LiveMatchUpdateDto
    ) {
        const update = {
            events,
            applications: [...applications.map((e) => new Types.ObjectId(e))]
        };

        // update = {
        //     $addToSet: {
        //         events: {$each: [...events]},
        //         applications: {$each: applications.map((e) => new Types.ObjectId(e)),}
        //     },
        // };


        await this.matchEventModel.findByIdAndUpdate<IApplicationDocument>({_id}, update);
        return this.findOneById<IApplicationDocument>(_id);
    }
}
