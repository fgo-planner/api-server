import { ObjectID, ObjectId } from 'bson';
import { Request, Response } from 'express';
import { GetMapping, RestController, UserAccessLevel } from 'internal';
import { HttpRequestUtils } from 'utils';

const MaxObjectIdsPerRequest = 100;

@RestController('/entity', UserAccessLevel.Public)
export class EntityController {

    @GetMapping('/new-object-id')
    async getNewObjectId(_req: Request, res: Response): Promise<any> {
        try {
            const objectId = new ObjectId();
            res.send({ objectId });
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/new-object-ids-max-count')
    async getMaxObjectIdsPerRequest(_req: Request, res: Response): Promise<any> {
        res.send(String(MaxObjectIdsPerRequest));
    }

    @GetMapping('/new-object-ids/:count')
    async getNewObjectIds(req: Request, res: Response): Promise<any> {
        try {
            const count = HttpRequestUtils.parseNumericalValueFromParams(req.params, 'count');
            if (count < 1 || count > MaxObjectIdsPerRequest) {
                throw new Error(`Count must be between 1 and ${MaxObjectIdsPerRequest} (inclusive)`);
            }
            const objectIds: Array<ObjectID> = [];
            for (let i = 0; i < MaxObjectIdsPerRequest; i++) {
                objectIds.push(new ObjectId());
            }
            res.send({ objectIds });
        } catch (err) {
            res.status(400).send(err);
        }
    }

}
