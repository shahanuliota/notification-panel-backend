export class IGroup {

    readonly _id: string;

    readonly isActive: boolean;
    readonly name: string;
    readonly description: string;
    readonly owner: string;
    readonly createdAt: Date;

    constructor(data) {
        this.name = data.name;
        this._id = data._id;
        this.isActive = data.isActive;
        this.description = data.description;
        this.createdAt = data.createdAt;
        this.owner = data.owner.toString();
    }
}