import { GameDataImportResult } from './game-data-import-result.type';

export type GameDataImportResultSet = {
    items?: GameDataImportResult;
    servants?: GameDataImportResult;
    soundtracks?: GameDataImportResult;
};
