import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {DATABASE_CONNECTION_NAME} from "../../common/database/constants/database.constant";
import {AppGroupDocumentDatabaseName, AppGroupEntity, AppGroupSchema} from "./schemas/app-groups.schema";
import {GroupService} from "./services/group.service";
import {GroupBulkService} from "./services/group.bulk.service";

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: AppGroupEntity.name,
                    schema: AppGroupSchema,
                    collection: AppGroupDocumentDatabaseName,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
    providers: [GroupService, GroupBulkService],
    exports: [GroupService, GroupBulkService]
})
export class GroupModule {
}
