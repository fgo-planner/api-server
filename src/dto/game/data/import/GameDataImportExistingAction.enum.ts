const Skip = 'Skip';
const Override = 'Override';
const Append = 'Append';

export type GameDataImportExistingAction =
    typeof Skip |
    typeof Override |
    typeof Append;

export const GameDataImportExistingAction = {
    Skip,
    Override,
    Append
} as const;
