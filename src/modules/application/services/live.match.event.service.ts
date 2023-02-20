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
import {ApplicationEntity} from "../schemas/application.schema";
import {NotificationOptionEnum} from "../constant/match-event.constant";
import {HttpService} from "@nestjs/axios";
import {EventTriggerService} from "./event-trigger.service";
import {UserService} from "../../user/services/user.service";
import {EventNameEntity} from "../schemas/event-name.schema";

@Injectable()
export class LiveMatchEventService {
    constructor(
        @DatabaseEntity(MatchEventEntity.name)
        private readonly matchEventModel: Model<MatchEventDocument>,
        private readonly httpService: HttpService,
        private readonly triggerEvent: EventTriggerService,
        private readonly userService: UserService,
    ) {
    }

    async create(dto: LiveMatchEventCreateDto, name: string, user: IUserDocument): Promise<MatchEventDocument> {
        try {
            const date = new Date(dto.startTime * 1000);
            /// compare date
//            date.setMinutes(date.getMinutes() - 3);


            const create: MatchEventDocument = new this.matchEventModel<MatchEventEntity>({
                name: name,
                matchId: dto.matchId,
                events: dto.events.map((e) => new Types.ObjectId(e)),
                applications: dto.applications.map((e) => new Types.ObjectId(e)),
                owner: user._id,
                teamA: dto.teamA,
                teamB: dto.teamB,
                startTime: dto.startTime,
                schedule: date,

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
        const findAll = this.matchEventModel.find(find)
            .populate({
                path: 'applications',
                model: ApplicationEntity.name,
                select: ['_id', 'name']

            })
            .populate({
                path: 'events',
                model: EventNameEntity.name,
                select: ['_id', 'name', 'message']

            })
        ;
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
        const applications = this.matchEventModel.findById(_id).populate({
            path: 'applications',
            model: ApplicationEntity.name,
            select: ['_id', 'name']

        }).populate({
            path: 'events',
            model: EventNameEntity.name,
            select: ['_id', 'name', 'message']

        });
        return applications.lean();
    }

    async update(
        _id: string,
        {applications, events}: LiveMatchUpdateDto
    ) {
        const update = {
            events: [...events.map((e) => new Types.ObjectId(e))],
            applications: [...applications.map((e) => new Types.ObjectId(e))]
        };

        // update = {
        //     $addToSet: {
        //         events: {$each: [...events]},
        //         applications: {$each: applications.map((e) => new Types.ObjectId(e)),}
        //     },
        // };


        await this.matchEventModel.findByIdAndUpdate<MatchEventDocument>({_id}, update);
        const match: MatchEventDocument = await this.findOneById<MatchEventDocument>(_id);
        await this.setNextEvents(match);
        return await this.findOneById<MatchEventDocument>(_id);
    }


    async updateScheduleTme(_id: string, time: Date) {

        const update = {
            schedule: time
        };
        await this.matchEventModel.findByIdAndUpdate<MatchEventDocument>({_id}, update);
    }


    async setNextEvents(match: MatchEventDocument) {

        const eData: any[] = match.events;
        const events: string[] = eData.map<string>(e => e.name.toString());
        console.log({events});

        const timestamp = match.startTime;
        const targetTime = new Date(timestamp * 1000);
        const now = new Date();
        const differenceInMs = targetTime.getTime() - now.getTime();

        if (events.includes(NotificationOptionEnum.toss)) {


            targetTime.setMinutes(targetTime.getMinutes() - 30);
            console.log({targetTime});
            const differenceInMs = targetTime.getTime() - now.getTime();

            if (differenceInMs < 0) {
                console.log('The target time has already passed.');
                now.setMinutes(now.getMinutes() + 2);
                await this.updateScheduleTme(match._id, now);

            } else {
                console.log(`The target time is ${differenceInMs} milliseconds from now.`);
                await this.updateScheduleTme(match._id, targetTime);
            }


        } else if (events.includes(NotificationOptionEnum.firstInnings)) {
            await this.updateScheduleTme(match._id, differenceInMs < 0 ? now : targetTime);
        } else if (events.includes(NotificationOptionEnum.lastInnings)) {

        }

        return;
    }

    async triggerEvents(match: MatchEventDocument) {

        const dat: any[] = match.events;
        const events: string[] = dat.map<string>(e => e.name.toString());

        const applications: string[] = match.applications.map<string>(e => e._id.toString());
        try {
            console.log('triggerEvents called with match id ' + match.matchId);
            const user = await this.userService.findOne<IUserDocument>({email: 'admin@mail.com'});
            const matchUrl = `https://rest.entitysport.com/v2/matches/${match.matchId}/info?token=${user.apiToken}`;
            const req = this.httpService.get(matchUrl);
            const res = await req.toPromise();
            // console.log({res: res.data});
            const resData = res.data.response;

            ///if match Abandoned, canceled, no result
            if (resData.status == 4) {
                return this.deleteOne({_id: match._id});
            }


            // test purpose
            // if (true) {
            //     const message = resData.short_title;
            //     await this.triggerEvent.triggerEvents(applications, message, 'Schedule');
            //     return this.setNextEvents(match);
            // }


            if (events.includes(NotificationOptionEnum.toss)) {

                const message = resData.toss.text;
                if (message) {
                    await this.triggerEvent.triggerEvents(applications, message, 'Toss');
                    const filteredArray = events.filter(item => item != NotificationOptionEnum.toss);
                    return await this.update(match._id, {
                        events: filteredArray,
                        applications: applications,
                    });
                }
                /// if no toss then trigger event after 10 minute
                if (resData.status == 1) {
                    const targetTime = new Date();
                    targetTime.setMinutes(targetTime.getMinutes() + 10);
                    return await this.updateScheduleTme(match._id, targetTime);
                }

            } else if (events.includes(NotificationOptionEnum.firstInnings)) {
                if (resData.status == 1) {
                    const targetTime = new Date();
                    targetTime.setMinutes(targetTime.getMinutes() + 10);
                    return await this.updateScheduleTme(match._id, targetTime);
                }
                /// if match is live then trigger events
                if (resData.status == 3) {
                    const message = resData.title + 'match started';
                    if (resData.title) {
                        await this.triggerEvent.triggerEvents(applications, message, 'Match Started');
                    }
                }
                /// remove firstInnings event from list
                const filteredArray = events.filter(item => item != NotificationOptionEnum.firstInnings);
                return await this.update(match._id, {
                    events: filteredArray,
                    applications: applications,
                });

                /// after complete first innings
                if (events.includes(NotificationOptionEnum.lastInnings) && resData.status == 3) {
                    const targetTime = new Date();
                    targetTime.setMinutes(targetTime.getMinutes() + 40);
                    return await this.updateScheduleTme(match._id, targetTime);
                }


            } else if (events.includes(NotificationOptionEnum.lastInnings)) {

                /// if match completed
                if (resData.status == 2) {

                    const message = resData.status_note;
                    if (resData.message) {
                        await this.triggerEvent.triggerEvents(applications, message, 'Match Completed');
                    }
                    return this.deleteOne({_id: match._id});
                } else {
                    const targetTime = new Date();
                    targetTime.setMinutes(targetTime.getMinutes() + 40);
                    return await this.updateScheduleTme(match._id, targetTime);
                }

            }

        } catch (e) {
            console.log({error: '[triggerEvents] error occurred'});
            console.log({e});
        }


        return;
    }

}
