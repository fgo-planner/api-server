import { GameItem, GameItemCategory } from 'data/types';
import { Inject, Service } from 'typedi';
import { GameItemService } from './game-item.service';
import { GameObjectImportExportService } from './game-object-import-export.service';

@Service()
export class GameItemImportExportService extends GameObjectImportExportService<GameItem> {

    /**
     * List of properties that are imported and exported through this service.
     */
    private readonly _Properties: ReadonlyArray<string> = [
        'name',
        'nameJp',
        'urlPath',
        'rarity',
        'gameId',
        'gameRegions',
        'description',
        'categories'
    ];
 
    @Inject()
    private _gameItemService: GameItemService;

    protected _convertJsonItemToObject(object: any): GameItem {
        throw new Error('Method not implemented.');
    }

    protected _convertCsvLineToObject(columnIndexMap: { [key: string]: number }, line: string[]): GameItem {
        const result: { [key: string]: any } = {};
        for (const property of this._Properties) {
            const value = this._getValueFromCsvLine(columnIndexMap, property, line);
            switch (property) {
            case 'rarity':
            case 'gameId':
                result[property] = this._parseNumberFromCsv(value);
                break;
            case 'gameRegions':
                result[property] = this._parseGameRegionsFromCsv(value);
                break;
            case 'categories':
                result[property] = this._parseCategoriesFromCsv(value);
                break;
            default:
                result[property] = value;
            }
        }
        return result as GameItem;
    }

    private _parseCategoriesFromCsv(value: string) {
        if (value == null) {
            return [];
        }
        const categories = value.split(',');
        return categories.filter(c => c in GameItemCategory);
    }

    protected async _validateAndWriteObject(object: GameItem) {
        // if (await this._gameItemService.existsByUrlPath(object.urlPath)) {
        //     return;
        // }
        try {
            await this._gameItemService.create(object);
        } catch (e) {
            console.error(e);
        }
    }

}