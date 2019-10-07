export type GameItemCategory = 
    'Points' |
    'Consumable' |
    'Exchange' |
    'CommandCode' |
    'BondUnlock' |
    'Skill' |
    'Ascension' |
    'SpecialReward' |
    'ExperienceUp' |
    'StatusUp' |
    'MysticCode' |
    'EventItem' |
    'QuestUnlockingKey' |
    'EventBPRecoveryItem';

export default () => {
    return [
        'Points',
        'Consumable',
        'Exchange',
        'CommandCode',
        'BondUnlock',
        'Skill',
        'Ascension',
        'SpecialReward',
        'ExperienceUp',
        'StatusUp',
        'MysticCode',
        'EventItem',
        'QuestUnlockingKey',
        'EventBPRecoveryItem'
    ] as GameItemCategory[];
};
