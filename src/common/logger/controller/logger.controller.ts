import {Controller, Get, Res, StreamableFile} from '@nestjs/common';
import {createReadStream, readdirSync, statSync} from 'fs';
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
                        fileList.push(dirPath + "/" + file);
                    }
                }
            });
            if (fileList.length !== 0) {
                arrayOfFiles[dirPath] = fileList;
            }

            return arrayOfFiles;
        };
        const result = getAllFiles("logs", {});
        return {"ok": result};
    }

}