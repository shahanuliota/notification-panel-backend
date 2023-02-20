import {INotifyManager} from "./notify-manager";

export class DefaultNotifyManager extends INotifyManager {
    notify(): Promise<any> {
        return Promise.resolve(undefined);
    }
}
