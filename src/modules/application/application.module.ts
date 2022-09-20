import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {DATABASE_CONNECTION_NAME} from "../../common/database/constants/database.constant";
import {ApplicationDatabaseName, ApplicationEntity, ApplicationSchema} from "./schemas/application.schema";

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
})
export class ApplicationModule {
}
