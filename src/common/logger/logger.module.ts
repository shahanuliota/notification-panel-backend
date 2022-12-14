import {Global, Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {DATABASE_CONNECTION_NAME} from '../database/constants/database.constant';
import {LoggerDatabaseName, LoggerEntity, LoggerSchema,} from './schemas/logger.schema';
import {LoggerService} from './services/logger.service';
import {LoggerController} from "./controller/logger.controller";

@Global()
@Module({
    providers: [LoggerService],
    exports: [LoggerService],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: LoggerEntity.name,
                    schema: LoggerSchema,
                    collection: LoggerDatabaseName,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
    controllers: [
        LoggerController
    ]
})
export class LoggerModule {
}
