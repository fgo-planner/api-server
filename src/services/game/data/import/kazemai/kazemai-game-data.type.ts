/**
 * An item from the `mstCombineLimit` collection.
 */
export type KazemaiGameDataMstCombineLimit = {
    itemIds: number[];
    itemNums: number[];
    id: number;
    svtLimit: number;
    qp: number;
};

/**
 * An item from the `mstCombineSkill` collection.
 */
export type KazemaiGameDataMstCombineSkill = {
    itemIds: number[];
    itemNums: number[];
    id: number;
    skillLv: number;
    qp: number;
};

/**
 * An item from the `mstCv` collection.
 */
export type KazemaiGameDataMstCv = {
    id: number;
    name: string;
};

/**
 * An item from the `mstFriendship` collection.
 */
export type KazemaiGameDataMstFriendship = {
    itemIds: [];
    itemNums: [];
    id: number;
    rank: number;
    friendship: number;
    qp: number;
};

/**
 * An item from the `mstIllustrator` collection.
 */
export type KazemaiGameDataMstIllustrator = {
    id: number;
    name: string;
};

/**
 * An item from the `mstItem` collection.
 */
export type KazemaiGameDataMstItem = {
    script: any;
    eventId: number;
    eventGroupId: number;
    id: number;
    name: string;
    detail: string;
    imageId: number;
    type: number;
    dropPriority: number;
};

/**
 * An item from the `mstSkill` collection.
 */
export type KazemaiGameDataMstSkill = {
    id: number;
    type: number;
    name: string;
    maxLv: number;
    iconId: number;
};

/**
 * An item from the `mstSkillDetail` collection.
 */
export type KazemaiGameDataMstSkillDetail = {
    id: number;
    detail: string;
};

/**
 * An item from the `mstSvt` collection.
 */
export type KazemaiGameDataMstSvt = {
    relateQuestIds: number[];
    individuality: number[];
    classPassive: number[];
    cardIds: number[];
    script: number[];
    id: number;
    baseSvtId: number;
    name: string;
    ruby: string;
    battleName: string;
    classId: number;
    type: number;
    limitMax: number;
    rewardLv: number;
    friendshipId: number;
    maxFriendshipRank: number;
    genderType: number;
    attri: number;
    combineSkillId: number;
    combineLimitId: number;
    sellQp: number;
    sellMana: number;
    sellRarePri: number;
    expType: number;
    combineMaterialId: number;
    cost: number;
    battleSize: number;
    starRate: number;
    deathRate: number;
    attackAttri: number;
    illustratorId: number;
    cvId: number;
    collectionNo: number;
    materialStoryPriority: number;
    flag: number;
};

/**
 * An item from the `mstSvtCard` collection.
 */
export type KazemaiGameDataMstSvtCard = {
    normalDamage: number[];
    svtId: number;
    cardId: number;
};

/**
 * An item from the `mstSvtLimit` collection.
 */
export type KazemaiGameDataMstSvtLimit = {
    svtId: number;
    limitCount: number;
    rarity: number;
    lvMax: number;
    hpBase: number;
    hpMax: number;
    atkBase: number;
    atkMax: number;
    criticalWeight: number;
    power: number;
    defense: number;
    agility: number;
    magic: number;
    luck: number;
    treasureDevice: number;
    policy: number;
    personality: number;
    deity: number;
};

/**
 * An item from the `mstSvtSkill` collection.
 */
export type KazemaiGameDataMstSvtSkill = {
    strengthStatus: number;
    svtId: number;
    num: number;
    priority: number;
    skillId: number;
    condQuestId: number;
    condQuestPhase: number;
    condLv: number;
    condLimitCount: number;
    eventId: number;
    flag: number;
};

/**
 * An item from the `mstSvtTreasureDevice` collection.
 */
export type KazemaiGameDataMstSvtTreasureDevice = {
    damage: number[];
    strengthStatus: number;
    svtId: number;
    num: number;
    priority: number;
    flag: number;
    treasureDeviceId: number;
    condQuestId: number;
    condQuestPhase: number;
    condLv: number;
    condFriendshipRank: number;
    cardId: number;
};

/**
 * An item from the `mstTreasureDevice` collection.
 */
export type KazemaiGameDataMstTreasureDevice = {
    script: any;
    id: number;
    name: string;
    ruby: string;
    rank: string;
    maxLv: number;
    typeText: string;
    effectFlag: number;
};

/**
 * An item from the `mstTreasureDeviceDetail` collection.
 */
export type KazemaiGameDataMstTreasureDeviceDetail = {
    id: number;
    detail: string;
}

/**
 * Root data model.
 */
export type KazemaiGameData = {
    mstAttriRelation: any[];
    mstAuraEffectPosOverwrite: any[];
    mstBoxGachaExtra: any[];
    mstClassRelation: any[];
    mstCombineLimit: KazemaiGameDataMstCombineLimit[];
    mstCombineSkill: KazemaiGameDataMstCombineSkill[];
    mstCommandCardRankParam: any[];
    mstCommandCode: any[];
    mstCommandCodeComment: any[];
    mstCommandCodeSkill: any[];
    mstCommonRelease: any[];
    mstCv: KazemaiGameDataMstCv[];
    mstEquip: any[];
    mstEquipExp: any[];
    mstEquipSkill: any[];
    mstEventBonusFilter: any[];
    mstEventBonusFilterGroupInfo: any[];
    mstEventBonusFilterGroupMember: any[];
    mstEventBossStatusUi: any[];
    mstEventCampaignRelease: any[];
    mstEventEquipSkillRelease: any[];
    mstEventMission: any[];
    mstFriendship: KazemaiGameDataMstFriendship[];
    mstGift: any[];
    mstIllustrator: KazemaiGameDataMstIllustrator[];
    mstItem: KazemaiGameDataMstItem[];
    mstPrivilege: any[];
    mstQuest: any[];
    mstQuestConsumeItem: any[];
    mstQuestDateRange: any[];
    mstQuestPhase: any[];
    mstQuestRelease: any[];
    mstQuestSpotRelease: any[];
    mstSkill: KazemaiGameDataMstSkill[];
    mstSkillDetail: KazemaiGameDataMstSkillDetail[];
    mstSkillLv: any[];
    mstSpot: any[];
    mstStatusEffectPosOverwrite: any[];
    mstSvt: KazemaiGameDataMstSvt[];
    mstSvtCard: KazemaiGameDataMstSvtCard[];
    mstSvtCommentAdd: any[];
    mstSvtCostume: any[];
    mstSvtExp: any[];
    mstSvtLimit: KazemaiGameDataMstSvtLimit[];
    mstSvtLimitAdd: any[];
    mstSvtSkill: KazemaiGameDataMstSvtSkill[];
    mstSvtSkillRelease: any[];
    mstSvtTreasureDevice: KazemaiGameDataMstSvtTreasureDevice[];
    mstSvtTreasureDeviceDamage: any[];
    mstTreasureDevice: KazemaiGameDataMstTreasureDevice[];
    mstTreasureDeviceDetail: KazemaiGameDataMstTreasureDeviceDetail[];
    mstTreasureDeviceLv: any[];
    mstUserExp: any[];
    mstVoiceClosedMessage: any[];
    mstWar: any[];
    mstWarBgm: any[];
    mstWarClear: any[];
    npcSvtEquip: any[];
};
