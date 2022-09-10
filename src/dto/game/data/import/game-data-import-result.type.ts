import { TransformLogger } from '@fgo-planner/transform-core';

export type GameDataImportResult = {
    updated: number;
    created: number;
    errors: number;
    logs?: TransformLogger;
};
