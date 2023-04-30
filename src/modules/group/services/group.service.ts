import { Injectable } from '@nestjs/common';
import { DatabaseEntity } from '../../../common/database/decorators/database.decorator';
import { Model } from 'mongoose';
import { AppGroupDocument, AppGroupEntity } from '../schemas/app-groups.schema';
import { GroupCreateDto } from '../dtos/create.group.dto';
import { IUserDocument } from '../../user/user.interface';
import { IDatabaseFindAllOptions } from '../../../common/database/database.interface';
import { GroupUpdateDto } from '../dtos/update.group.dto';

@Injectable()
export class GroupService {
    constructor(
        @DatabaseEntity(AppGroupEntity.name)
        private readonly groupModel: Model<AppGroupDocument>
    ) {}

    async create(
        data: GroupCreateDto,
        user: IUserDocument
    ): Promise<AppGroupDocument> {
        try {
            const create: AppGroupDocument = new this.groupModel({
                name: data.name,
                description: data.description,
                isActive: data.isActive || true,
                owner: user._id,
            });

            return create.save();
        } catch (e) {
            //console.log(e);
            throw e;
        }
    }

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<AppGroupDocument[]> {
        const findAll = this.groupModel.find(find);
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

    async findOneById(_id: string): Promise<AppGroupDocument> {
        return this.groupModel.findById(_id).lean();
    }

    async findOne(find?: Record<string, any>): Promise<AppGroupDocument> {
        return this.groupModel.findOne(find).lean();
    }

    async getTotal(find?: Record<string, any>): Promise<number> {
        return this.groupModel.countDocuments(find);
    }

    async deleteOne(find: Record<string, any>): Promise<AppGroupDocument> {
        return this.groupModel.findOneAndDelete(find);
    }

    async update(
        _id: string,
        { name, description }: GroupUpdateDto
    ): Promise<AppGroupDocument> {
        const group = await this.groupModel.findById(_id);

        group.name = name;
        group.description = description;
        return group.save();
    }

    async inactive(_id: string): Promise<AppGroupDocument> {
        const group: AppGroupDocument = await this.groupModel.findById(_id);

        group.isActive = false;
        return group.save();
    }

    async active(_id: string): Promise<AppGroupDocument> {
        const group: AppGroupDocument = await this.groupModel.findById(_id);

        group.isActive = true;
        return group.save();
    }
}
