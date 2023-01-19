import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {DATABASE_CONNECTION_NAME} from "../../common/database/constants/database.constant";
import {ApplicationDatabaseName, ApplicationEntity, ApplicationSchema} from "./schemas/application.schema";
import {ApplicationService} from "./services/application.service";
import {TaskScheduleDatabaseName, TaskScheduleEntity, TaskScheduleSchema} from "./schemas/task_schedule.schema";
import {ScheduleService} from "./services/schedule.service";

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
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],

    providers: [ApplicationService, ScheduleService],
    exports: [ApplicationService, ScheduleService],
})
export class ApplicationModule {
}
