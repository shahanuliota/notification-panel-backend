import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ApplicationService } from './application.service';
import { ApplicationDocument } from '../schemas/application.schema';

@Injectable()
export class EventTriggerService {
    constructor(
        private readonly httpService: HttpService,
        private readonly applicationService: ApplicationService
    ) {}

    async triggerEvents(
        applications: string[],
        message: string,
        headings: string
    ) {
        console.log('triggerEvents called ');
        console.log({ applications });

        for (const app of applications) {
            const id: string = app;
            const appl: ApplicationDocument =
                await this.applicationService.findOne({ _id: id });
            console.log({ appl });
            if (appl) {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Basic ${appl.basic_auth_key}`,
                    },
                };
                console.log({ config });
                try {
                    const data = {
                        app_id: appl.application_id,
                        //  "app_name": appl.name,
                        included_segments: [
                            'Subscribed Users',
                            'Total Subscriptions',
                        ],
                        data: {
                            foo: 'bar',
                        },
                        isIos: true,
                        ios_badgeType: 'SetTo',
                        ios_badgeCount: 1,
                        content_available: 1,
                        contents: {
                            en: message,
                        },
                        headings: {
                            en: headings,
                        },
                    };

                    const req = this.httpService.post(
                        'https://onesignal.com/api/v1/notifications',
                        JSON.stringify(data),
                        config
                    );
                    const res = await req.toPromise();
                    // console.log(res);
                    console.log(res.data);
                    //  console.log(res.headers);
                } catch (e) {
                    console.log({ error: 'error occurred' });
                    console.log(e.response.data);
                }
            }
        }
    }
}
