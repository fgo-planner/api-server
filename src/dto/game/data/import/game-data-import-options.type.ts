import { GameDataImportExistingAction } from './game-data-import-existing-action.enum';

type GameDataImportOption = {
    import?: boolean;
    onExisting?: GameDataImportExistingAction;
};

export type GameDataImportOptions = {
    items?: GameDataImportOption;
    servants?: GameDataImportOption;
    soundtracks?: GameDataImportOption;
};
