import {Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {DeleteResult} from 'mongodb';
import {DatabaseEntity} from 'src/common/database/decorators/database.decorator';
import {AppGroupDocument, AppGroupEntity} from "../schemas/app-groups.schema";

@Injectable()
export class GroupBulkService {
    constructor(
        @DatabaseEntity(AppGroupEntity.name)
        private readonly groupModel: Model<AppGroupDocument>
    ) {
    }

    // async createMany(data: IAuthPermission[]): Promise<AppGroupDocument[]> {
    //     return this.groupModel.insertMany(
    //         data.map(({ isActive, code, description, name }) => ({
    //             code: code,
    //             name: name,
    //             description: description,
    //             isActive: isActive || true,
    //         }))
    //     );
    // }

    async deleteMany(find: Record<string, any>): Promise<DeleteResult> {
        return this.groupModel.deleteMany(find);
    }
}
