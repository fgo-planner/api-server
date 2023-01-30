import { Request, Response } from 'express';
import { CachedResponse, CacheKey, GetMapping, InvalidateCachedResponse, PostMapping, PutMapping, ResponseCacheKey, RestController, UserAccessLevel } from 'internal';
import { ParsedQs } from 'qs';
import { GameServantService } from 'services';
import { Inject } from 'typedi';
import { HttpRequestUtils, PaginationUtils } from 'utils';

const metadataRequested = (query: ParsedQs): boolean => {
    const metadataParam = query['metadata'];
    if (typeof metadataParam !== 'string') {
        /**
         * Always include metadata by default.
         */
        return true;
    }
    return metadataParam.toLowerCase() === 'true';
};

const metadataRequestedSubKey = (req: Request): CacheKey => {
    const includeMetadata = metadataRequested(req.query);
    if (includeMetadata) {
        return ResponseCacheKey.GameServant_IncludeMetadata;
    } else {
        return ResponseCacheKey.GameServant_ExcludeMetadata;
    }
};

const externalLinksSubKey = (req: Request): CacheKey => {
    const id = HttpRequestUtils.parseNumericalIdFromParams(req.params, 'id');
    return `${ResponseCacheKey.GameServant_ExternalLinks}_${id}`;
};

@RestController('/game-servant', UserAccessLevel.Public)
export class GameServantController {

    @Inject()
    private _gameServantService!: GameServantService;

    @PutMapping(UserAccessLevel.Admin)
    @InvalidateCachedResponse(ResponseCacheKey.GameServant, [200])
    async createServant(req: Request, res: Response): Promise<any> {
        let servant = req.body;
        try {
            servant = await this._gameServantService.create(servant);
            res.send(servant);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping()
    @CachedResponse(ResponseCacheKey.GameServant, metadataRequestedSubKey)
    async getServants(req: Request, res: Response): Promise<any> {
        const includeMetadata = metadataRequested(req.query);
        try {
            const servants = await this._gameServantService.findAll(includeMetadata);
            res.send(servants);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/page')
    async getServantsPage(req: Request, res: Response): Promise<any> {
        const query = req.query;
        try {
            const pagination = PaginationUtils.parse(query);
            const includeMetadata = metadataRequested(query);
            const page = await this._gameServantService.findPage(pagination, includeMetadata);
            res.send(page);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/:id')
    async getServant(req: Request, res: Response): Promise<any> {
        try {
            const id = HttpRequestUtils.parseNumericalIdFromParams(req.params, 'id');
            const includeMetadata = metadataRequested(req.query);
            const servant = await this._gameServantService.findById(id, includeMetadata);
            if (!servant) {
                return res.status(404).send(`Servant ID ${id} could not be found.`);
            }
            res.send(servant);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/:id/metadata/external-links')
    @CachedResponse(ResponseCacheKey.GameServant, externalLinksSubKey)
    async getExternalLinks(req: Request, res: Response): Promise<any> {
        try {
            const id = HttpRequestUtils.parseNumericalIdFromParams(req.params, 'id');
            const links = await this._gameServantService.getExternalLinks(id);
            if (!links) {
                return res.status(404).send(`Servant ID ${id} could not be found.`);
            }
            res.send(links);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/metadata/fgo-manager-names')
    @CachedResponse(ResponseCacheKey.GameServant, ResponseCacheKey.GameServant_FgoManagerNames)
    async getFgoManagerNamesMap(_: Request, res: Response): Promise<any> {
        try {
            const map = await this._gameServantService.getFgoManagerNamesMap();
            res.send(map);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/metadata/search-keywords')
    @CachedResponse(ResponseCacheKey.GameServant, ResponseCacheKey.GameServant_SearchKeywords)
    async getSearchKeywordsMap(_: Request, res: Response): Promise<any> {
        try {
            const map = await this._gameServantService.getSearchKeywordsMap();
            res.send(map);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @PostMapping(UserAccessLevel.Admin)
    @InvalidateCachedResponse(ResponseCacheKey.GameServant, [200])
    async updateServant(req: Request, res: Response): Promise<any> {
        let servant = req.body;
        try {
            servant = await this._gameServantService.update(servant);
            if (!servant) {
                return res.status(404).send(`Servant ID ${req.body._id} does not exist.`);
            }
            res.send(servant);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @PostMapping('/invalidate-cache', UserAccessLevel.Admin)
    @InvalidateCachedResponse(ResponseCacheKey.GameServant)
    invalidateCache(_: Request, res: Response): void {
        res.send();
    }

}
