import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {ApplicationService} from "./application.service";
import {ApplicationDocument} from "../schemas/application.schema";

@Injectable()
export class EventTriggerService {
    constructor(private readonly httpService: HttpService, private readonly applicationService: ApplicationService,) {


    }


    async triggerEvents(applications: string[], message: string, headings: string) {

        for (const app of applications) {
            const id: string = app;
            const appl: ApplicationDocument = await this.applicationService.findOne({application_id: id});
            if (appl) {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${appl.basic_auth_key}`
                    },
                };
                console.log({config});
                try {
                    const data = {
                        "app_id": appl.application_id,
                        "included_segments": ["Subscribed Users"],
                        "data": {"message": message},
                        "contents": {"en": message},
                        "headings": {"en": headings},
                    };
                    const req = this.httpService.post("https://onesignal.com/api/v1/notifications", JSON.stringify({data}), config,);
                    const res = await req.toPromise();
                    console.log(res);
                    console.log(res.data);
                    console.log(res.headers);

                } catch (e) {
                    console.log({error: 'error occurred'});
                    console.log({e});
                }
            }

        }

    }
}
