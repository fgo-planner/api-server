import { CollectionUtils } from '@fgo-planner/common-core';
import { Entity, ExternalLink, GameServant, GameServantMetadata, GameServantWithMetadata, SearchTagUtils } from '@fgo-planner/data-core';
import { GameServantModel } from '@fgo-planner/data-mongo';
import { Page, Pagination } from 'dto';
import { ProjectionType, SortOrder } from 'mongoose';
import { Service } from 'typedi';
import { PaginationUtils } from 'utils';

type SearchTagsMetadata = {
    metadata: Pick<GameServantMetadata, 'searchTags'>;
};

@Service()
export class GameServantService {

    async create(servant: GameServantWithMetadata): Promise<GameServantWithMetadata> {
        // TODO Validation
        const document = await GameServantModel.create(servant);
        return document.toJSON<GameServantWithMetadata>();
    }

    async existsById(id: number): Promise<boolean> {
        const document = await GameServantModel.exists({ _id: id });
        return !!document;
    }

    async findById(id: number, includeMetadata: false): Promise<GameServant | null>;
    async findById(id: number, includeMetadata?: true): Promise<GameServantWithMetadata | null>;
    async findById(id: number, includeMetadata?: boolean): Promise<GameServant | GameServantWithMetadata>;
    async findById(id: number, includeMetadata = true): Promise<GameServant | GameServantWithMetadata | null> {
        const projection = this._getMetadataProjection(includeMetadata);
        const document = await GameServantModel.findById(id, projection);
        if (!document) {
            return null;
        }
        return document.toJSON<GameServant | GameServantWithMetadata>();
    }

    async findAll(includeMetadata: false): Promise<Array<GameServant>>;
    async findAll(includeMetadata?: true): Promise<Array<GameServantWithMetadata>>;
    async findAll(includeMetadata?: boolean): Promise<Array<GameServant> | Array<GameServantWithMetadata>>;
    async findAll(includeMetadata = true): Promise<Array<GameServant> | Array<GameServantWithMetadata>> {
        const projection = this._getMetadataProjection(includeMetadata);
        const documents = await GameServantModel.find({}, projection);
        return documents.map(document => document.toJSON<GameServantWithMetadata>());
    }

    async findByIds(ids: Array<number>, includeMetadata: false): Promise<Array<GameServant>>;
    async findByIds(ids: Array<number>, includeMetadata?: true): Promise<Array<GameServantWithMetadata>>;
    async findByIds(ids: Array<number>, includeMetadata?: boolean): Promise<Array<GameServant> | Array<GameServantWithMetadata>>;
    async findByIds(ids: Array<number>, includeMetadata = true): Promise<Array<GameServant> | Array<GameServantWithMetadata>> {
        if (!ids || !ids.length) {
            return [];
        }
        const projection = this._getMetadataProjection(includeMetadata);
        const documents = await GameServantModel.find({ _id: { $in: ids } }, projection);
        return documents.map(document => document.toJSON<GameServant | GameServantWithMetadata>());
    }

    async findAllIds(): Promise<Array<number>> {
        return GameServantModel.distinct('_id');
    }

    async findPage(pagination: Pagination, includeMetadata: false): Promise<Page<GameServant>>;
    async findPage(pagination: Pagination, includeMetadata?: true): Promise<Page<GameServantWithMetadata>>;
    async findPage(pagination: Pagination, includeMetadata: boolean): Promise<Page<GameServant> | Page<GameServantWithMetadata>>;
    async findPage(pagination: Pagination, includeMetadata = true): Promise<Page<GameServant> | Page<GameServantWithMetadata>> {

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
        const documents = await GameServantModel.find({}, projection)
            .sort(sort)
            .skip(skip)
            .limit(size);

        const data = documents.map(document => document.toJSON<GameServant | GameServantWithMetadata>());

        return PaginationUtils.toPage(data, count, page, size);
    }

    async getExternalLinks(id: number): Promise<Array<ExternalLink> | null> {
        const document = await GameServantModel.findExternalLinksById(id);
        if (!document) {
            return null;
        }
        return document.metadata.links;
    }

    async getFgoManagerNamesMap(): Promise<Record<string, number>> {
        const documents = await GameServantModel.find({}, { 'metadata.fgoManagerName': 1 });
        const result: Record<string, number> = {};
        for (const document of documents) {
            const fgoManagerName = document.metadata.fgoManagerName;
            if (!fgoManagerName) {
                continue;
            }
            result[fgoManagerName] = document._id;
        }
        return result;
    }

    async getSearchKeywordsMap(): Promise<Record<number, string>> {
        const documents = await GameServantModel.findSearchTags();
        documents[0].metadata;
        return CollectionUtils.mapIterableToObject(
            documents,
            this._getIdFunction,
            this._generateSearchKeywords
        );
    }

    async update(servant: GameServantWithMetadata): Promise<GameServantWithMetadata | null> {
        const id = Number(servant._id);
        if (!id && id !== 0) {
            throw 'ID is missing or invalid.';
        }
        const document = await GameServantModel.findOneAndUpdate(
            { _id: id },
            { $set: servant },
            { runValidators: true, new: true }
        );
        if (!document) {
            return null;
        }
        return document.toJSON<GameServantWithMetadata>();
    }

    private _getMetadataProjection(includeMetadata: boolean): ProjectionType<GameServantWithMetadata> | undefined {
        if (!includeMetadata) {
            return GameServantModel.ExcludeMetadataProjection;
        }
        return undefined;
    }

    private _getIdFunction(entity: Entity<unknown, number>): number {
        return entity._id;
    }

    private _generateSearchKeywords({ metadata }: SearchTagsMetadata): string {
        const keywordSet = SearchTagUtils.generateSearchKeywords(metadata.searchTags);
        return [...keywordSet].join(' ');
    }

}
