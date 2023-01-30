import { Request, Response } from 'express';
import { GetMapping, RestController, UserAccessLevel } from 'internal';

@RestController('/app', UserAccessLevel.Public)
export class AppInfoController {

    @GetMapping('/health-check')
    healthCheck(_: Request, res: Response): void {
        res.sendStatus(200);
    }

}
