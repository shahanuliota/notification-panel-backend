import {INotifyManager} from "./notify-manager";
import {EventTriggerService} from "../services/event-trigger.service";
import {MatchEventDocument} from "../schemas/match.event.schema";
import {LiveMatchEventService} from "../services/live.match.event.service";
import {EventNameDocument} from "../schemas/event-name.schema";
import {NotificationOptionEnum} from "../constant/match-event.constant";

export class FirstInningsNotifyManager extends INotifyManager {


    constructor(
        private readonly response: any,
        private readonly triggerEvent: EventTriggerService,
        private readonly match: MatchEventDocument,
        private readonly liveMatchEventService: LiveMatchEventService,
    ) {
        super();
    }

    notify(): Promise<any> {
        const dat: any[] = this.match.events;
        const events: EventNameDocument[] = dat.map<EventNameDocument>(e => e);
        const event = events.find(e => e.name == NotificationOptionEnum.firstInnings);


        if (event) {
            /// if match not started
            if (this.response.status == 1) {
                return this.updateEventTime();
            }
            /// if match started
            else if (this.response.status == 3) {
                // const message = event.message || this.response.title + 'match started';
                const message = `${this.response.title} - ${this.response.subtitle} ${event.message}`;
                return this.triggerNotification(message, event.header);
            }

        }


        return Promise.resolve(undefined);
    }

    async deleteIfNeeded() {
        return this.liveMatchEventService.deleteOne({_id: this.match._id});
    }

    private async triggerNotification(message: string, header: string) {

        const applications: string[] = this.match.applications.map<string>(e => e._id.toString());
        await this.triggerEvent.triggerEvents(applications, message, header);
        await this.updateMatchEvent(applications);


    }

    private async updateMatchEvent(applications: string[]) {
        const dat: any[] = this.match.events;
        const events: EventNameDocument[] = dat.map<EventNameDocument>(e => e);
        const filteredArray = events.filter(item => item.name != NotificationOptionEnum.firstInnings);

        if (filteredArray.length != 0) {
            await this.liveMatchEventService.update(this.match._id, {
                events: filteredArray.map(e => e._id),
                applications: applications,
            });
            return this.updateEventTime();
        } else {
            await this.deleteIfNeeded();
        }

    }

    private async updateEventTime() {
        const targetTime = new Date();

        targetTime.setMinutes(targetTime.getMinutes() + 10);
        return await this.liveMatchEventService.updateScheduleTme(this.match._id, targetTime);
    }
}
