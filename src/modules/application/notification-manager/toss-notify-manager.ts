import {INotifyManager} from "./notify-manager";
import {EventTriggerService} from "../services/event-trigger.service";
import {MatchEventDocument} from "../schemas/match.event.schema";
import {EventNameDocument} from "../schemas/event-name.schema";
import {NotificationOptionEnum} from "../constant/match-event.constant";
import {LiveMatchEventService} from "../services/live.match.event.service";

export class TossNotifyManager extends INotifyManager {

    constructor(
        private readonly response: any,
        private readonly triggerEvent: EventTriggerService,
        private readonly match: MatchEventDocument,
        private readonly liveMatchEventService: LiveMatchEventService,
    ) {
        super();
    }

    async notify(): Promise<any> {
        const dat: any[] = this.match.events;
        const events: EventNameDocument[] = dat.map<EventNameDocument>(e => e);
        //
        const event = events.find(e => e.name == NotificationOptionEnum.toss);


        if (event) {
            // const message = event.message || this.response.toss.text;
            const message = `${this.response.toss.text}  ${event.message}`;
            if (this.response.toss.text) {
                await this.triggerNotification(message, event.header);
            } else {
                return this.updateEventTime();
            }
        }
        return Promise.resolve(true);
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
        const filteredArray = events.filter(item => item.name != NotificationOptionEnum.toss);

        if (filteredArray.length != 0) {
            await this.liveMatchEventService.update(this.match._id, {
                events: filteredArray.map(e => e._id),
                applications: applications,
            });

            const firstInnings = events.find(e => e.name == NotificationOptionEnum.firstInnings);
            if (firstInnings) {
                await this.updateForFirstInnings();
            }
        } else {
            await this.deleteIfNeeded();
        }

    }


    private async updateForFirstInnings() {
        const targetTime = new Date(this.match.startTime * 1000);
        const now = new Date();
        const differenceInMs = targetTime.getTime() - now.getTime();
        now.setMinutes(now.getMinutes() + 2);
        return await this.liveMatchEventService.updateScheduleTme(this.match._id, differenceInMs < 0 ? now : targetTime);
    }

    private async updateEventTime() {
        const targetTime = new Date();
        targetTime.setMinutes(targetTime.getMinutes() + 3);
        return await this.liveMatchEventService.updateScheduleTme(this.match._id, targetTime);
    }
}

