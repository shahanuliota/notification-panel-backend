import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {DATABASE_CONNECTION_NAME} from "../../common/database/constants/database.constant";
import {ApplicationDatabaseName, ApplicationEntity, ApplicationSchema} from "./schemas/application.schema";
import {ApplicationService} from "./services/application.service";

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: ApplicationEntity.name,
                    schema: ApplicationSchema,
                    collection: ApplicationDatabaseName,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],

    providers: [ApplicationService],
    exports: [ApplicationService],
})
export class ApplicationModule {
}
