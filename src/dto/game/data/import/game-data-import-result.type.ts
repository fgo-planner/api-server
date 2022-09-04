import { BaseLogger } from '@fgo-planner/transform-external';

export type GameDataImportResult = {
    updated: number;
    created: number;
    errors: number;
    logs?: BaseLogger;
};
