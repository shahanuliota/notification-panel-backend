import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Response } from 'express';
import { ENUM_REQUEST_STATUS_CODE_ERROR } from 'src/common/request/constants/request.status-code.constant';
import { IRequestApp } from 'src/common/request/request.interface';
import userAgentParserJs from 'ua-parser-js';

@Injectable()
export class UserAgentMiddleware implements NestMiddleware {
    constructor(private readonly configService: ConfigService) {}

    use(req: IRequestApp, res: Response, next: NextFunction): void {
        const mode: string = this.configService.get<string>('app.mode');
        const os: string[] = this.configService.get<string[]>(
            'middleware.userAgent.os'
        );
        const browser: string[] = this.configService.get<string[]>(
            'middleware.userAgent.browser'
        );

        if (mode === 'secure') {
            // Put your specific user agent
            const userAgent: string = req.headers['user-agent'] as string;

            //console.log({userAgent});
            if (!userAgent) {
                throw new ForbiddenException({
                    statusCode:
                        ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_USER_AGENT_INVALID_ERROR,
                    message: 'middleware.error.userAgentInvalid',
                });
            }

            const userAgentParser = userAgentParserJs(
                req.headers['user-agent']
            );

            // console.log({userAgentParser});
            if (
                !os.some((val) =>
                    val.match(new RegExp(userAgentParser.os.name))
                )
            ) {
                throw new ForbiddenException({
                    statusCode:
                        ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_USER_AGENT_OS_INVALID_ERROR,
                    message: 'middleware.error.userAgentOsInvalid',
                });
            }
            // console.log({browser});
            // console.log({userAgentParser: userAgentParser.browser.name});
            // console.log({rex: new RegExp(userAgentParser.browser.name)});

            if (
                !browser.some((val) =>
                    val.match(new RegExp(userAgentParser.browser.name))
                )
            ) {
                throw new ForbiddenException({
                    statusCode:
                        ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_USER_AGENT_BROWSER_INVALID_ERROR,
                    message: 'middleware.error.userAgentBrowserInvalid',
                });
            }

            req.userAgent = userAgentParser;
        }
        next();
    }
}
