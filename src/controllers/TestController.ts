import { Request, Response } from 'express';
import { GetMapping, RestController, UserAccessLevel } from 'internal';
import { ObjectId } from 'bson';

@RestController('/test', UserAccessLevel.Public)
export class TestController {

    @GetMapping()
    testObjectId(req: Request, res: Response): void {
        try {
            const data = new ObjectId(undefined);
            res.send(data);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/file-upload', UserAccessLevel.Admin)
    test(req: Request, res: Response): void {
        const fileContents = req.file?.buffer.toString();
        try {
            if (!fileContents) {
                throw 'No file!';
            }
            const data = JSON.parse(fileContents);
            res.send(data);
        } catch (err) {
            res.status(400).send(err);
        }
    }

}
