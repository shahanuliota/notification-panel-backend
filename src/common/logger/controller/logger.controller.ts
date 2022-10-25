import {Controller, Get, Res, StreamableFile} from '@nestjs/common';
import {createReadStream} from 'fs';
import {join} from 'path';
import type {Response} from 'express';

@Controller({
    version: '1',
    path: '/logger',
})
export class LoggerController {

    @Get()
    getFile(@Res({passthrough: true}) res: Response): StreamableFile {
        const file = createReadStream(join(process.cwd(), 'logs/http/2022-10-24.log'));
        res.set({
            'Content-Type': 'application/json',
            'Content-Disposition': 'attachment; filename="2022-10-24.log"',
        });
        return new StreamableFile(file);
    }

}