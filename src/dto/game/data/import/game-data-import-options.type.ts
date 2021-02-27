import { GameDataImportExistingAction } from './game-data-import-existing-action.enum';

export type GameDataImportOptions = {
    items?: {
        import?: boolean;
        onExisting?: GameDataImportExistingAction;
    };
    servants?: {
        import?: boolean;
        onExisting?: GameDataImportExistingAction;
    };
};
