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
import {UserModule} from "../user/user.module";
import {EventNameDatabaseName, EventNameEntity, EventNameSchema} from "./schemas/event-name.schema";
import {EventNameService} from "./services/event-name.service";

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
                },
                {
                    name: MatchEventEntity.name,
                    schema: MatchEventSchema,
                    collection: MatchEventDatabaseName,
                },
                {
                    name: EventNameEntity.name,
                    schema: EventNameSchema,
                    collection: EventNameDatabaseName,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
        HttpModule,
        UserModule,
    ],

    providers: [ApplicationService, ScheduleService, LiveMatchEventService, EventTriggerService, EventNameService],
    exports: [ApplicationService, ScheduleService, LiveMatchEventService, EventTriggerService, EventNameService],
})
export class ApplicationModule {
}
