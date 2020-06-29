import { Logger } from 'internal';

export type GameDataImportResult = {
    updated: number;
    created: number;
    errors: number;
    logs?: Logger;
}
