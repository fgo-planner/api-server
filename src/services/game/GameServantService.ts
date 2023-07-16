import { CollectionUtils } from '@fgo-planner/common-core';
import { EntityUtils, ExternalLink, GameServantMetadata, GameServantWithMetadata, SearchTagUtils } from '@fgo-planner/data-core';
import { GameServantDocument, GameServantModel, GameServantWithMetadataDocument } from '@fgo-planner/data-mongo';
import { Page, Pagination } from 'dto';
import { ProjectionType, SortOrder } from 'mongoose';
import { Service } from 'typedi';
import { PaginationUtils } from 'utils';

type AnyGameServantDocument = GameServantDocument | GameServantWithMetadataDocument;

type AnyGameServantDocuments = Array<GameServantDocument> | Array<GameServantWithMetadataDocument>;

type AnyGameServantDocumentPage = Page<GameServantDocument> | Page<GameServantWithMetadataDocument>;

type SearchTagsMetadata = {
    metadata: Pick<GameServantMetadata, 'searchTags'>;
};

@Service()
export class GameServantService {

    async create(servant: GameServantWithMetadata): Promise<GameServantWithMetadataDocument> {
        const document = await GameServantModel.create(servant);
        return document.toObject<GameServantWithMetadataDocument>();
    }

    async existsById(id: number): Promise<boolean> {
        const document = await GameServantModel.exists({ _id: id }).lean();
        return !!document;
    }

    async findById(id: number, includeMetadata: false): Promise<GameServantDocument | null>;
    async findById(id: number, includeMetadata?: true): Promise<GameServantWithMetadataDocument | null>;
    async findById(id: number, includeMetadata?: boolean): Promise<AnyGameServantDocument>;
    async findById(id: number, includeMetadata = true): Promise<AnyGameServantDocument | null> {
        const projection = this._getMetadataProjection(includeMetadata);
        return await GameServantModel.findById(id, projection).lean();
    }

    async findAll(includeMetadata: false): Promise<Array<GameServantDocument>>;
    async findAll(includeMetadata?: true): Promise<Array<GameServantWithMetadataDocument>>;
    async findAll(includeMetadata?: boolean): Promise<AnyGameServantDocuments>;
    async findAll(includeMetadata = true): Promise<AnyGameServantDocuments> {
        const projection = this._getMetadataProjection(includeMetadata);
        return await GameServantModel.find({}, projection).lean();
    }

    async findByIds(ids: Array<number>, includeMetadata: false): Promise<Array<GameServantDocument>>;
    async findByIds(ids: Array<number>, includeMetadata?: true): Promise<Array<GameServantWithMetadataDocument>>;
    async findByIds(ids: Array<number>, includeMetadata?: boolean): Promise<AnyGameServantDocuments>;
    async findByIds(ids: Array<number>, includeMetadata = true): Promise<AnyGameServantDocuments> {
        if (!ids || !ids.length) {
            return [];
        }
        const projection = this._getMetadataProjection(includeMetadata);
        return await GameServantModel.find({ _id: { $in: ids } }, projection).lean();
    }

    async findAllIds(): Promise<Array<number>> {
        return GameServantModel.distinct('_id');
    }

    async findPage(pagination: Pagination, includeMetadata: false): Promise<Page<GameServantDocument>>;
    async findPage(pagination: Pagination, includeMetadata?: true): Promise<Page<GameServantWithMetadataDocument>>;
    async findPage(pagination: Pagination, includeMetadata: boolean): Promise<AnyGameServantDocumentPage>;
    async findPage(pagination: Pagination, includeMetadata = true): Promise<AnyGameServantDocumentPage> {

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
            .limit(size)
            .lean();

        return PaginationUtils.toPage(documents, count, page, size);
    }

    async getExternalLinks(id: number): Promise<Array<ExternalLink> | null> {
        const document = await GameServantModel.findExternalLinksById(id).lean();
        if (!document) {
            return null;
        }
        return document.metadata.links;
    }

    async getFgoManagerNamesMap(): Promise<Record<string, number>> {
        const documents = await GameServantModel.findFgoManagerNames().lean();
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
        const documents = await GameServantModel.findSearchTags().lean();
        documents[0].metadata;
        return CollectionUtils.mapIterableToObject(
            documents,
            EntityUtils.getId,
            this._generateSearchKeywords
        );
    }

    async update(servant: GameServantWithMetadata): Promise<GameServantWithMetadataDocument | null> {
        const id = Number(servant._id);
        if (!id && id !== 0) {
            throw 'ID is missing or invalid.';
        }
        return await GameServantModel.findOneAndUpdate(
            { _id: id },
            { $set: servant },
            { runValidators: true, new: true }
        ).lean();
    }

    private _getMetadataProjection(includeMetadata: boolean): ProjectionType<GameServantWithMetadata> | undefined {
        if (!includeMetadata) {
            return GameServantModel.ExcludeMetadataProjection;
        }
        return undefined;
    }

    private _generateSearchKeywords({ metadata }: SearchTagsMetadata): string {
        const keywordSet = SearchTagUtils.generateSearchKeywords(metadata.searchTags);
        return [...keywordSet].join(' ');
    }

}
