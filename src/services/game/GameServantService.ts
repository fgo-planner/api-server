import { CollectionUtils } from '@fgo-planner/common-core';
import { ExternalLink, GameServant, GameServantModel, GameServantWithMetadata, SearchTagUtils } from '@fgo-planner/data-mongo';
import { Page, Pagination } from 'dto';
import { ProjectionType, SortOrder } from 'mongoose';
import { Service } from 'typedi';
import { PaginationUtils } from 'utils';

@Service()
export class GameServantService {

    private static readonly _ProjectionExcludeMetadata: ProjectionType<GameServantWithMetadata> = { metadata: false } as const;

    async create(servant: GameServantWithMetadata): Promise<GameServantWithMetadata> {
        // TODO Validation
        const result = await GameServantModel.create(servant);
        return result.toObject();
    }

    async existsById(id: number): Promise<boolean> {
        const result = await GameServantModel.exists({ _id: id });
        return !!result;
    }

    async findById(id: number, includeMetadata: false): Promise<GameServant | null>;
    async findById(id: number, includeMetadata?: true): Promise<GameServantWithMetadata | null>;
    async findById(id: number, includeMetadata?: boolean): Promise<GameServant | GameServantWithMetadata>;
    async findById(id: number, includeMetadata = true): Promise<GameServant | GameServantWithMetadata | null> {
        const projection = this._getMetadataProjection(includeMetadata);
        const result = await GameServantModel.findById(id, projection);
        if (!result) {
            return null;
        }
        return result.toObject();
    }

    async findAll(includeMetadata: false): Promise<Array<GameServant>>;
    async findAll(includeMetadata?: true): Promise<Array<GameServantWithMetadata>>;
    async findAll(includeMetadata?: boolean): Promise<Array<GameServant> | Array<GameServantWithMetadata>>;
    async findAll(includeMetadata = true): Promise<Array<GameServant> | Array<GameServantWithMetadata>> {
        const projection = this._getMetadataProjection(includeMetadata);
        const result = await GameServantModel.find({}, projection);
        return result.map(doc => doc.toObject());
    }

    async findByIds(ids: Array<number>, includeMetadata: false): Promise<Array<GameServant>>;
    async findByIds(ids: Array<number>, includeMetadata?: true): Promise<Array<GameServantWithMetadata>>;
    async findByIds(ids: Array<number>, includeMetadata?: boolean): Promise<Array<GameServant> | Array<GameServantWithMetadata>>;
    async findByIds(ids: Array<number>, includeMetadata = true): Promise<Array<GameServant> | Array<GameServantWithMetadata>> {
        if (!ids || !ids.length) {
            return [];
        }
        const projection = this._getMetadataProjection(includeMetadata);
        const result = await GameServantModel.find({ _id: { $in: ids } }, projection);
        return result.map(doc => doc.toObject());
    }

    async findAllIds(): Promise<Array<number>> {
        const result = await GameServantModel.distinct('_id');
        return result.map(doc => doc.toObject());
    }

    async findPage(pagination: Pagination, includeMetadata: false): Promise<Page<GameServant>>;
    async findPage(pagination: Pagination, includeMetadata?: true): Promise<Page<GameServantWithMetadata>>;
    async findPage(pagination: Pagination, includeMetadata: boolean): Promise<Page<GameServant> | Array<GameServantWithMetadata>>;
    async findPage(pagination: Pagination, includeMetadata = true): Promise<Page<GameServant> | Array<GameServantWithMetadata>> {

        const count = await GameServantModel.find()
            .countDocuments();

        const {
            size,
            page,
            sort: sortBy,
            direction
        } = pagination;

        const skip = size * (page - 1);
        const sort: Record<string, SortOrder> = { [sortBy]: direction === 'ASC' ? 1 : -1 };

        const projection = this._getMetadataProjection(includeMetadata);
        const result = await GameServantModel.find({}, projection)
            .sort(sort)
            .skip(skip)
            .limit(size);

        const data = result.map(doc => doc.toObject());

        return PaginationUtils.toPage(data, count, page, size);
    }

    async getExternalLinks(id: number): Promise<Array<ExternalLink> | null> {
        return await GameServantModel.getExternalLinks(id);
    }

    async getFgoManagerNamesMap(): Promise<Record<string, number>> {
        const docs = await GameServantModel.find({}, { 'metadata.fgoManagerName': 1 });
        const result: Record<string, number> = {};
        for (const doc of docs) {
            const fgoManagerName = doc.metadata.fgoManagerName;
            if (!fgoManagerName) {
                continue;
            }
            result[fgoManagerName] = doc._id;
        }
        return result;
    }

    async getSearchKeywordsMap(): Promise<Record<number, string>> {
        const result = await GameServantModel.find({}, { 'metadata.searchTags': 1 });
        return CollectionUtils.mapIterableToObject(
            result.map(doc => doc.toObject()),
            this._getIdFunction,
            this._generateSearchKeywords
        );
    }

    async update(servant: GameServantWithMetadata): Promise<GameServantWithMetadata | null> {
        const id = Number(servant._id);
        if (!id && id !== 0) {
            throw 'ID is missing or invalid.';
        }
        const result = await GameServantModel.findOneAndUpdate(
            { _id: id },
            { $set: servant },
            { runValidators: true, new: true }
        );
        if (!result) {
            return null;
        }
        return result.toObject();
    }

    private _getMetadataProjection(includeMetadata: boolean): ProjectionType<GameServantWithMetadata> | undefined {
        if (!includeMetadata) {
            return GameServantService._ProjectionExcludeMetadata;
        }
        return undefined;
    }

    private _getIdFunction(gameServant: GameServant): number {
        return gameServant._id;
    }

    private _generateSearchKeywords(gameServant: GameServantWithMetadata): string {
        const keywordSet = SearchTagUtils.generateSearchKeywords(gameServant.metadata.searchTags);
        return [...keywordSet].join(' ');
    }

}
