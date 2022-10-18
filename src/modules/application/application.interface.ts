import {PermissionDocument} from "../permission/schemas/permission.schema";
import {ApplicationDocument} from "./schemas/application.schema";

export interface IApplicationDocument extends Omit<ApplicationDocument, 'groups'> {
    groups: PermissionDocument[];
}