import {ApplicationDocument} from "./schemas/application.schema";
import {AppGroupDocument} from "../group/schemas/app-groups.schema";

export interface IApplicationDocument extends Omit<ApplicationDocument, 'groups'> {
    groups: AppGroupDocument[];
}