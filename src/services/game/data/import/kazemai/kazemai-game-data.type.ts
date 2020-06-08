/**
 * Item from the `mstCombineLimit` field.
 */
export type KazemaiGameDataMstCombineLimit = {
    itemIds: number[];
    itemNums: number[];
    id: number;
    svtLimit: number;
    qp: number;
};

/**
 * Item from the `mstCombineSkill` field.
 */
export type KazemaiGameDataMstCombineSkill = {
    itemIds: number[];
    itemNums: number[];
    id: number;
    skillLv: number;
    qp: number;
};

/**
 * Item from the `mstCv` field.
 */
export type KazemaiGameDataMstCv = {
    id: number;
    name: string;
};

/**
 * Item from the `mstIllustrator` field.
 */
export type KazemaiGameDataMstIllustrator = {
    id: number;
    name: string;
};

/**
 * Item from the `mstItem` field.
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
 * Item from the `mstSkill` field.
 */
export type KazemaiGameDataMstSkill = {
    id: number;
    type: number;
    name: string;
    maxLv: number;
    iconId: number;
};

/**
 * Item from the `mstSkillDetail` field.
 */
export type KazemaiGameDataMstSkillDetail = {
    id: number;
    detail: string;
};

/**
 * Item from the `mstSvt` field.
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
 * Item from the `mstSvtCard` field.
 */
export type KazemaiGameDataMstSvtCard = {
    normalDamage: number[];
    svtId: number;
    cardId: number;
};

/**
 * Item from the `mstSvtLimit` field.
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
 * Item from the `mstSvtSkill` field.
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
 * Item from the `mstSvtTreasureDevice` field.
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
 * Item from the `mstTreasureDevice` field.
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
 * Item from the `mstTreasureDeviceDetail` field.
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
    mstFriendship: any[];
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
