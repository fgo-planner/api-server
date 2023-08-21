import { GameDataImportExistingAction } from './GameDataImportExistingAction.enum';

type GameDataImportOption = {
    import?: boolean;
    onExisting?: GameDataImportExistingAction;
};

type GameServantImportOption = GameDataImportOption & {
    minCollectionNo?: number;
    maxCollectionNo?: number;
};

export type GameDataImportOptions = {
    items?: GameDataImportOption;
    servants?: GameServantImportOption;
    soundtracks?: GameDataImportOption;
};
