import {INotifyManager} from "./notify-manager";
import {EventTriggerService} from "../services/event-trigger.service";
import {MatchEventDocument} from "../schemas/match.event.schema";
import {LiveMatchEventService} from "../services/live.match.event.service";
import {EventNameDocument} from "../schemas/event-name.schema";
import {NotificationOptionEnum} from "../constant/match-event.constant";

export class TimeIntervalNotifyManager extends INotifyManager {
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
        const event = events.find(e => e.name == NotificationOptionEnum.timeInterval);

        if (event) {
            /// match live
            if (this.response.status == 3) {
                if (this.response.game_state == 3) {
                    let winnerTeam = this.response.teama;
                    if (this.response.toss.decision == 1) {
                        winnerTeam = this.response.teama.team_id == this.response.toss.winner ? this.response.teama : this.response.teamb;
                    } else {
                        winnerTeam = this.response.teama.team_id == this.response.toss.winner ? this.response.teamb : this.response.teama;

                    }

                    let currentTeam = winnerTeam;
                    if (this.response.latest_inning_number == 1) {
                        currentTeam = winnerTeam.team_id == this.response.teama.team_id ? this.response.teama : this.response.teamb;
                    } else {
                        currentTeam = winnerTeam.team_id == this.response.teama.team_id ? this.response.teamb : this.response.teama;
                    }


                    const message = `${currentTeam.name} - ${currentTeam.scores_full}`;
                    return await this.triggerNotification(message, event.header);
                }


            }
            /// match completed
            else if (this.response.status == 2) {
                return this.deleteIfNeeded();
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

        if (this.response.status == 2 || this.response.status == 4) {
            const filteredArray = events.filter(item => item.name != NotificationOptionEnum.timeInterval);
            if (filteredArray.length != 0) {
                await this.liveMatchEventService.update(this.match._id, {
                    events: filteredArray.map(e => e._id),
                    applications: applications,
                });
                return this.updateEventTime();
            } else {
                return this.deleteIfNeeded();
            }
        } else {
            return this.updateEventTime();
        }


    }

    private async updateEventTime() {
        const targetTime = new Date();
        try {
            const dat: any[] = this.match.events;
            const events: EventNameDocument[] = dat.map<EventNameDocument>(e => e);
            const event = events.find(e => e.name == NotificationOptionEnum.timeInterval);
            const time: number = parseInt(event.message);
            targetTime.setMinutes(targetTime.getMinutes() + time);
            return await this.liveMatchEventService.updateScheduleTme(this.match._id, targetTime);

        } catch (e) {
        }

    }
}
