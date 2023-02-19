import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {DATABASE_CONNECTION_NAME} from "../../common/database/constants/database.constant";
import {ApplicationDatabaseName, ApplicationEntity, ApplicationSchema} from "./schemas/application.schema";
import {ApplicationService} from "./services/application.service";
import {TaskScheduleDatabaseName, TaskScheduleEntity, TaskScheduleSchema} from "./schemas/task_schedule.schema";
import {ScheduleService} from "./services/schedule.service";
import {HttpModule} from "@nestjs/axios";
import {MatchEventDatabaseName, MatchEventEntity, MatchEventSchema} from "./schemas/match.event.schema";
import {LiveMatchEventService} from "./services/live.match.event.service";
import {EventTriggerService} from "./services/event-trigger.service";

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: ApplicationEntity.name,
                    schema: ApplicationSchema,
                    collection: ApplicationDatabaseName,
                },
                {
                    name: TaskScheduleEntity.name,
                    schema: TaskScheduleSchema,
                    collection: TaskScheduleDatabaseName,
                }, {
                name: MatchEventEntity.name,
                schema: MatchEventSchema,
                collection: MatchEventDatabaseName,
            },
            ],
            DATABASE_CONNECTION_NAME
        ),
        HttpModule,
    ],

    providers: [ApplicationService, ScheduleService, LiveMatchEventService, EventTriggerService],
    exports: [ApplicationService, ScheduleService, LiveMatchEventService, EventTriggerService],
})
export class ApplicationModule {
}
