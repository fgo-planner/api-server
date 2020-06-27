import { Request, Response } from 'express';
import { GetMapping, RestController, UserAccessLevel } from 'internal';

@RestController('/test', UserAccessLevel.Admin)
export class TestController {

    @GetMapping('/file-upload')
    test(req: Request, res: Response) {
        const fileContents = req.file.buffer.toString();
        try {
            const data = JSON.parse(fileContents);
            res.send(data);
        } catch (err) {
            res.status(400).send(err);
        }
    }

}
