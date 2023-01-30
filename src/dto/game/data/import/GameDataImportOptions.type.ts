import { GameDataImportExistingAction } from './GameDataImportExistingAction.enum';

type GameDataImportOption = {
    import?: boolean;
    onExisting?: GameDataImportExistingAction;
};

export type GameDataImportOptions = {
    items?: GameDataImportOption;
    servants?: GameDataImportOption;
    soundtracks?: GameDataImportOption;
};
