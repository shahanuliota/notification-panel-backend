import {Controller, Get, Param, Res, StreamableFile} from '@nestjs/common';
import {createReadStream, readdirSync, statSync} from 'fs';
import {join} from 'path';
import * as ex from 'express';
import {RequestParamGuard} from "../../request/decorators/request.decorator";
import {FileRequestDto} from "../dto/file.request.dto";

import {Response} from 'src/common/response/decorators/response.decorator';

@Controller({
    version: '1',
    path: '/logger',
})
export class LoggerController {

    @RequestParamGuard(FileRequestDto)
    @Get('log/http/:name')
    getFile(@Res({passthrough: true}) res: ex.Response, @Param('name') filename: string): StreamableFile {

        console.log({filename});
        const file = createReadStream(join(process.cwd(), 'logs/http/2022-10-31.log'));
        res.set({
            'Content-Type': 'application/json',
            'Content-Disposition': 'attachment; filename="2022-10-24.log"',
        });
        return new StreamableFile(file);
    }

    @Response('logger.get')
    @Get('/files')
    fileName() {


        const getAllFiles = (dirPath, arrayOfFiles) => {
            const files = readdirSync(dirPath);

            arrayOfFiles = arrayOfFiles || {};
            const fileList = [];

            files.forEach(function (file) {
                if (statSync(dirPath + "/" + file).isDirectory()) {
                    arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
                } else {
                    if (file.endsWith('.log')) {
                        fileList.push(file);
                    }
                }
            });
            if (fileList.length !== 0) {
                arrayOfFiles[dirPath] = fileList;
            }

            return arrayOfFiles;
        };
        const result = getAllFiles("logs", {});
        return {"logger": result};
    }

}