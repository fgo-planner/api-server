// TODO Move this to separate file?
export type FunctionType =
    'none' |
    'addState' |
    'subState' |
    'damage' |
    'damageNp' |
    'gainStar' |
    'gainHp' |
    'gainNp' |
    'lossNp' |
    'shortenSkill' |
    'extendSkill' |
    'releaseState' |
    'lossHp' |
    'instantDeath' |
    'damageNpPierce' |
    'damageNpIndividual' |
    'addStateShort' |
    'gainHpPer' |
    'damageNpStateIndividual' |
    'hastenNpturn' |
    'delayNpturn' |
    'damageNpHpratioHigh' |
    'damageNpHpratioLow' |
    'cardReset' |
    'replaceMember' |
    'lossHpSafe' |
    'damageNpCounter' |
    'damageNpStateIndividualFix' |
    'damageNpSafe' |
    'callServant' |
    'ptShuffle' |
    'lossStar' |
    'changeServant' |
    'changeBg' |
    'damageValue' |
    'withdraw' |
    'fixCommandcard' |
    'shortenBuffturn' |
    'extendBuffturn' |
    'shortenBuffcount' |
    'extendBuffcount' |
    'changeBgm' |
    'displayBuffstring' |
    'resurrection' |
    'gainNpBuffIndividualSum' |
    'setSystemAliveFlag' |
    'forceInstantDeath' |
    'damageNpRare' |
    'gainNpFromTargets' |
    'gainHpFromTargets' |
    'lossHpPer' |
    'lossHpPerSafe' |
    'shortenUserEquipSkill' |
    'quickChangeBg' |
    'shiftServant' |
    'damageNpAndCheckIndividuality' |
    'absorbNpturn' |
    'overwriteDeadType' |
    'forceAllBuffNoact' |
    'breakGaugeUp' |
    'breakGaugeDown' |
    'moveToLastSubmember' |
    'expUp' |
    'qpUp' |
    'dropUp' |
    'friendPointUp' |
    'eventDropUp' |
    'eventDropRateUp' |
    'eventPointUp' |
    'eventPointRateUp' |
    'transformServant' |
    'qpDropUp' |
    'servantFriendshipUp' |
    'userEquipExpUp' |
    'classDropUp' |
    'enemyEncountCopyRateUp' |
    'enemyEncountRateUp' |
    'enemyProbDown' |
    'getRewardGift' |
    'sendSupportFriendPoint' |
    'movePosition' |
    'revival' |
    'damageNpIndividualSum' |
    'damageValueSafe' |
    'friendPointUpDuplicate' |
    'moveState' |
    'changeBgmCostume' |
    'func126' |
    'func127' |
    'updateEntryPositions' |
    'buddyPointUp';

// TODO Move this to separate file?
export type FunctionTargetType =
    'self' |
    'ptOne' |
    'ptAnother' |
    'ptAll' |
    'enemy' |
    'enemyAnother' |
    'enemyAll' |
    'ptFull' |
    'enemyFull' |
    'ptOther' |
    'ptOneOther' |
    'ptRandom' |
    'enemyOther' |
    'enemyRandom' |
    'ptOtherFull' |
    'enemyOtherFull' |
    'ptselectOneSub' |
    'ptselectSub' |
    'ptOneAnotherRandom' |
    'ptSelfAnotherRandom' |
    'enemyOneAnotherRandom' |
    'ptSelfAnotherFirst' |
    'ptSelfBefore' |
    'ptSelfAfter' |
    'ptSelfAnotherLast' |
    'commandTypeSelfTreasureDevice' |
    'fieldOther' |
    'enemyOneNoTargetNoAction' |
    'ptOneHpLowestValue' |
    'ptOneHpLowestRate';

// TODO Move this to separate file?
export type FunctionTargetTeam = 'player' | 'enemy' | 'playerAndEnemy';

/**
 * Partial type definition for Atlas Academy's `NiceFunction` data schema.
 */
export type AtlasAcademyNiceFunction = {
    funcId: number;
    funcType: FunctionType;
    funcTargetType: FunctionTargetType;
    funcTargetTeam: FunctionTargetTeam;
};
