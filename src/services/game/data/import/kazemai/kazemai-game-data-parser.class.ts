import { GameCharacter, GameCharacterAttribute, GameCharacterCardType, GameCharacterClass, GameCharacterGender, GameCraftEssence, GameEnhancementCard, GameNpc, GameObject, GameObjectSkill, GameObjectSkillUnlockable, GameServant, GameServantAscension, GameServantDeck, GameServantGrowthRate, GameServantNoblePhantasm, GameServantUpgrade, GameSpiritOrigin, GameSpiritOriginCollection, GameSkillRank } from 'data/types';
import { GameDataImportParser } from '../game-data-import-parser.class';
import { KazemaiGameData, KazemaiGameDataMstCombineLimit, KazemaiGameDataMstCombineSkill, KazemaiGameDataMstFriendship, KazemaiGameDataMstSkill, KazemaiGameDataMstSkillDetail, KazemaiGameDataMstSvt, KazemaiGameDataMstSvtCard, KazemaiGameDataMstSvtLimit, KazemaiGameDataMstSvtSkill, KazemaiGameDataMstSvtTreasureDevice, KazemaiGameDataMstTreasureDevice, KazemaiGameDataMstTreasureDeviceDetail } from './kazemai-game-data.type';
import { UnicodeUtils } from 'utils';

type LookupMap<V> = { [key: number]: V };

export class KazemaiGameDataParser extends GameDataImportParser<KazemaiGameData> {

    //#region Static enum value maps

    /**
     * Maps the `classId` values from `mstSvt` to a `GameCharacterClass` enum
     * constant.
     */
    private static readonly CharacterClassMap = {
        1: GameCharacterClass.Saber,
        2: GameCharacterClass.Archer,
        3: GameCharacterClass.Lancer,
        4: GameCharacterClass.Rider,
        5: GameCharacterClass.Caster,
        6: GameCharacterClass.Assassin,
        7: GameCharacterClass.Berserker,
        8: GameCharacterClass.Shielder,
        9: GameCharacterClass.Ruler,
        10: GameCharacterClass.AlterEgo,
        11: GameCharacterClass.Avenger,
        12: GameCharacterClass.Unknown, // Demon god pillar?
        17: GameCharacterClass.Caster, // Grand caster?
        20: GameCharacterClass.BeastII,
        22: GameCharacterClass.BeastI,
        23: GameCharacterClass.MoonCancer,
        24: GameCharacterClass.BeastIIIR,
        25: GameCharacterClass.Foreigner,
        26: GameCharacterClass.BeastIIIL,
        27: GameCharacterClass.BeastFalse
    } as { [key: number]: GameCharacterClass };

    /**
     * Maps the `attri` values from `mstSvt` to a `GameCharacterAttribute` enum
     * constant.
     */
    private static readonly CharacterAttributeMap = {
        1: GameCharacterAttribute.Man,
        2: GameCharacterAttribute.Sky,
        3: GameCharacterAttribute.Earth,
        4: GameCharacterAttribute.Star,
        5: GameCharacterAttribute.Beast
    } as { [key: number]: GameCharacterAttribute };

    /**
     * Maps the `genderType` values from `mstSvt` to a `GameCharacterGender` enum
     * constant.
     */
    private static readonly CharacterGenderMap = {
        1: GameCharacterGender.Male,
        2: GameCharacterGender.Female,
        3: GameCharacterGender.None
    } as { [key: number]: GameCharacterGender };

    /**
     * Maps `cardId` values `GameCharacterCardType` enum constant.
     */
    private static readonly CharacterCardTypeMap = {
        1: GameCharacterCardType.Arts,
        2: GameCharacterCardType.Buster,
        3: GameCharacterCardType.Quick
    } as { [key: number]: GameCharacterCardType };

    //#endregion


    //#region Data lookup maps

    private readonly _mstCombineSkillMapById: LookupMap<LookupMap<KazemaiGameDataMstCombineSkill>> = {};

    private readonly _mstCombineLimitMapById: LookupMap<LookupMap<KazemaiGameDataMstCombineLimit>> = {}

    private readonly _mstFriendshipMapById: LookupMap<LookupMap<KazemaiGameDataMstFriendship>> = {}

    private readonly _mstSvtCardMapBySvtId: LookupMap<LookupMap<KazemaiGameDataMstSvtCard>> = {}

    private readonly _mstSvtLimitMapBySvtId: LookupMap<KazemaiGameDataMstSvtLimit[]> = {}

    private readonly _mstSvtSkillMapBySvtId: LookupMap<KazemaiGameDataMstSvtSkill[]> = {}

    private readonly _mstSvtTreasureDeviceMapBySvtId: LookupMap<LookupMap<KazemaiGameDataMstSvtTreasureDevice>> = {}

    private readonly _mstSkillMapById: LookupMap<KazemaiGameDataMstSkill> = {}

    private readonly _mstSkillDetailMapById: LookupMap<KazemaiGameDataMstSkillDetail> = {}

    private readonly _mstTreasureDeviceMapById: LookupMap<KazemaiGameDataMstTreasureDevice> = {}

    private readonly _mstTreasureDeviceDetailMapById: LookupMap<KazemaiGameDataMstTreasureDeviceDetail> = {}

    //#endregion

    constructor(data: KazemaiGameData) {
        super(data, KazemaiGameDataParser.name);
    }

    // This should only be called by the superclass.
    protected _parse() {
        this._generateMaps();
        this._parseMstSvt();
    }

    /**
     * Generates maps of certain datasets for faster lookup during parsing.
     */
    private _generateMaps() {

        /*
         * Generate the map of `mstCombineSkill` objects using the `id` property as the
         * primary key and the `skillLv` property as the secondary key. It is assumed
         * that each combination of `id` and `skillLv` is unique.
         */
        for (const mstCombineSkill of this._data.mstCombineSkill) {
            let subMap = this._mstCombineSkillMapById[mstCombineSkill.id];
            if (!subMap) {
                subMap = this._mstCombineSkillMapById[mstCombineSkill.id] = {};
            }
            subMap[mstCombineSkill.skillLv] = mstCombineSkill;
        }

        /*
         * Generate the map of `mstCombineLimit` objects using the `id` property as the
         * primary key and the `svtLimit` property as the secondary key. It is assumed
         * that each combination of `id` and `svtLimit` is unique.
         */
        for (const mstCombineLimit of this._data.mstCombineLimit) {
            let subMap = this._mstCombineLimitMapById[mstCombineLimit.id];
            if (!subMap) {
                subMap = this._mstCombineLimitMapById[mstCombineLimit.id] = {};
            }
            subMap[mstCombineLimit.svtLimit] = mstCombineLimit;
        }

        /*
         * Generate the map of `mstFriendship` objects using the `id` property as the
         * primary key and the `rank` property as the secondary key. It is assumed that
         * each combination of `id` and `rank` is unique.
         */
        for (const mstFriendship of this._data.mstFriendship) {
            let subMap = this._mstFriendshipMapById[mstFriendship.id];
            if (!subMap) {
                subMap = this._mstFriendshipMapById[mstFriendship.id] = {};
            }
            subMap[mstFriendship.rank] = mstFriendship;
        }

        /*
         * Generate the map of `mstSvtCard` objects using the `svtId` property as the
         * primary key and the `cardId` property as the secondary key. It is assumed
         * that each combination of `id` and `cardId` is unique.
         */
        for (const mstSvtCard of this._data.mstSvtCard) {
            let subMap = this._mstSvtCardMapBySvtId[mstSvtCard.svtId];
            if (!subMap) {
                subMap = this._mstSvtCardMapBySvtId[mstSvtCard.svtId] = {};
            }
            subMap[mstSvtCard.cardId] = mstSvtCard;
        }

        /*
        * Generate the map of `mstSvtLimit` objects using the `svtId` property as the
         * key. Buckets (arrays) are used to store multiple entries for a single
         * `svtId` value.
         */
        for (const mstSvtLimit of this._data.mstSvtLimit) {
            let bucket = this._mstSvtLimitMapBySvtId[mstSvtLimit.svtId];
            if (!bucket) {
                bucket = this._mstSvtLimitMapBySvtId[mstSvtLimit.svtId] = [];
            }
            bucket.push(mstSvtLimit);
        }

        /*
         * Generate the map of `mstSvtSkill` objects using the `svtId` property as the
         * key. Buckets (arrays) are used to store multiple entries for a single
         * `svtId` value.
         */
        for (const mstSvtSkill of this._data.mstSvtSkill) {
            let bucket = this._mstSvtSkillMapBySvtId[mstSvtSkill.svtId];
            if (!bucket) {
                bucket = this._mstSvtSkillMapBySvtId[mstSvtSkill.svtId] = [];
            }
            bucket.push(mstSvtSkill);
        }

        /*
         * Generate the map of `mstSvtTreasureDevice` objects using the `svtId`
         * property as the primary key and the `strengthStatus` property as the
         * secondary key. It is assumed that each combination of `id` and
         * `strengthStatus` is  is unique.
         */
        for (const mstSvtTreasureDevice of this._data.mstSvtTreasureDevice) {
            // Currently, only the noble phantasm data (num == 1) is used.
            if (mstSvtTreasureDevice.num !== 1) {
                continue;
            }
            let subMap = this._mstSvtTreasureDeviceMapBySvtId[mstSvtTreasureDevice.svtId];
            if (!subMap) {
                subMap = this._mstSvtTreasureDeviceMapBySvtId[mstSvtTreasureDevice.svtId] = [];
            }
            subMap[mstSvtTreasureDevice.strengthStatus] = mstSvtTreasureDevice;
        }

        /*
         * Generate the map of `mstSkill` objects by their `id` value.
         */
        for (const mstSkill of this._data.mstSkill) {
            this._mstSkillMapById[mstSkill.id] = mstSkill;
        }

        /*
         * Generate the map of `mstSkillDetail` objects by their `id` value.
         */
        for (const mstSkillDetail of this._data.mstSkillDetail) {
            this._mstSkillDetailMapById[mstSkillDetail.id] = mstSkillDetail;
        }

        /*
         * Generate the map of `mstTreasureDevice` objects by their `id` value.
         */
        for (const mstTreasureDevice of this._data.mstTreasureDevice) {
            this._mstTreasureDeviceMapById[mstTreasureDevice.id] = mstTreasureDevice;
        }

        /*
         * Generate the map of `mstTreasureDeviceDetail` objects by their `id` value.
         */
        for (const mstTreasureDeviceDetail of this._data.mstTreasureDeviceDetail) {
            this._mstTreasureDeviceDetailMapById[mstTreasureDeviceDetail.id] = mstTreasureDeviceDetail;
        }
    }

    //#region Methods for parsing `mstSvt` data.

    private _parseMstSvt() {
        for (const mstSvt of this._data.mstSvt) {
            this._parseMstSvtObject(mstSvt);
        }
    }

    /**
     * Parses a `mstSvt` object and converts it into an object that extends from
     * the `GameObject` type.
     */
    private _parseMstSvtObject(mstSvt: KazemaiGameDataMstSvt) {
        /*
         * Type -1 is unknown, skip these for now.
         */
        if (mstSvt.type === -1) {
            return;
        }

        const object = {} as GameObject;

        object._id = mstSvt.id;
        object.nameJp = mstSvt.name;
        object.metadata = {
            altNames: [],
            tags: [],
            links: []
        };

        /*
         * Types 4 and 5 are NPCs. The remaining types are spirit origins.
         */
        if (mstSvt.type === 4 || mstSvt.type === 5) {
            this._populateNpcFromMstSvtObject(mstSvt, object as GameNpc);
        } else {
            this._populateSpiritOriginFromMstSvtObject(mstSvt, object as GameSpiritOrigin);
        }
    }

    /**
     * Populates the given `GameSpiritOrigin` object from the given `mstSvt`
     * object.
     */
    private _populateSpiritOriginFromMstSvtObject(mstSvt: KazemaiGameDataMstSvt, spiritOrigin: GameSpiritOrigin) {
        spiritOrigin.gameRegions = {
            JP: true
        };
        spiritOrigin.nameJpRuby = mstSvt.ruby;
        spiritOrigin.sell = {
            qp: mstSvt.sellQp,
            manaPrisms: mstSvt.sellMana,
            rarePrisms: mstSvt.sellRarePri,
        };

        /**
         * Rarity values are stored in the ascension data in the `mstSvtLimit`
         * collection.
         */
        const mstSvtLimitBucket = this._mstSvtLimitMapBySvtId[mstSvt.id];
        if (!mstSvtLimitBucket) {
            // TODO Log this.
        }
        /*
         * With the exception of Mash, all the ascension levels contain the same stat
         * values. The first element in the bucket is used for convenience.
         */
        spiritOrigin.rarity = mstSvtLimitBucket[0].rarity;

        /*
         * Type 3 is embers, type 7 is fous, which are not part of any collections.
         * These will be processed as `GameEnhancementCard` objects.
         */
        if (mstSvt.type === 3 || mstSvt.type === 7) {
            this._populateEnhancementCardFromMstSvtObject(mstSvt, spiritOrigin as GameEnhancementCard);
            return;
        }

        /*
         * The remaining types (1, 2, 6, 9) are all part of some collection.
         */
        const spiritOriginCollection = spiritOrigin as GameSpiritOriginCollection;
        spiritOriginCollection.collectionNo = mstSvt.collectionNo;
        if (mstSvt.illustratorId > 1) {
            spiritOriginCollection.metadata.illustratorId = mstSvt.illustratorId;
        }

        /*
         * Type 6 is craft essences, and the other types (1, 2, 9) are servants.
         */
        if (mstSvt.type === 6) {
            this._populateCraftEssenceFromMstSvtObject(mstSvt, spiritOriginCollection as GameCraftEssence);
        } else {
            this._populateServantFromMstSvtObject(mstSvt, spiritOriginCollection as GameServant);
        }
    }

    /**
     * Populates the given `GameEnhancementCard` object from the given `mstSvt`
     * object.
     */
    private _populateEnhancementCardFromMstSvtObject(mstSvt: KazemaiGameDataMstSvt, enhancementCard: GameEnhancementCard) {
        enhancementCard.class = mstSvt.classId === 1001 ? 'All' : this._getCharacterClass(mstSvt);
        // TODO Implement the rest of this
    }

    /**
     * Populates the given `GameCraftEssence` object from the given `mstSvt`
     * object.
     */
    private _populateCraftEssenceFromMstSvtObject(mstSvt: KazemaiGameDataMstSvt, craftEssence: GameCraftEssence) {
        // TODO Implement this
    }

    /**
     * Populates the given `GameServant` object from the given `mstSvt` object.
     * Inserts the `GameServant` object into the result object at the end of
     * the operation.
     */
    private _populateServantFromMstSvtObject(mstSvt: KazemaiGameDataMstSvt, servant: GameServant) {

        /*
         * This is a special case for Jekyll & Hyde where he has two entries, one of
         * which has a `collectionNo` of `0` and should not be processed.
         */
        if (mstSvt.collectionNo === 0) {
            return;
        }

        /*
         * Populate the properties that were inherited from the `GameCharacter` type.
         */
        this._populateCharacterFromMstSvtObject(mstSvt, servant);

        /*
         * Populate the properties that are specific to the `GameServant` type.
         */
        servant.cost = mstSvt.cost;
        servant.growthRate = this._getServantGrowthRate(mstSvt);
        this._populateServantCards(mstSvt, servant);
        this._populateServantNoblePhantasm(mstSvt, servant);
        this._populateServantPassiveSkills(mstSvt, servant);
        this._populateServantStats(mstSvt, servant);
        this._populateServantBond(mstSvt, servant);

        /*
         * Type 9 servants are neither summonable nor playable. These servants do
         * not have any active skill or ascension data.
         * 
         * Type 2 servant is Mash, who is the only playable but non-summonable
         * servant. The rest of the playable servants are type 1.
         */
        if (mstSvt.type === 9) {
            servant.summonable = false;
            servant.playable = false;
            servant.passiveSkills = [];
        } else {
            servant.summonable = mstSvt.type === 1;
            servant.playable = true;
            this._populateServantActiveSkills(mstSvt, servant);

            // Mash does not have any ascension upgrade data.
            if (mstSvt.type !== 2) {
                this._populateServantAscensions(mstSvt, servant);
            }
        }

        this._result.servants.push(servant); // Insert into result
    }

    /**
     * Populates the given `GameNpc` object from the given `mstSvt` object.
     */
    private _populateNpcFromMstSvtObject(mstSvt: KazemaiGameDataMstSvt, npc: GameNpc) {
        /*
         * Populate the properties that were inherited from the `GameCharacter` type.
         */
        this._populateCharacterFromMstSvtObject(mstSvt, npc);

        /*
         * Populate the properties that are specific to the `GameNpc` type.
         */
        npc._id = mstSvt.id;
        npc.nameJp = mstSvt.name;
        npc.battleNameJp = mstSvt.battleName;

        // TOOD Implement the rest of this...
    }

    /**
     * Populates the given `GameCharacter` object from the given `mstSvt` object.
     */
    private _populateCharacterFromMstSvtObject(mstSvt: KazemaiGameDataMstSvt, character: GameCharacter) {
        character.battleNameJp = mstSvt.battleName;
        character.class = this._getCharacterClass(mstSvt);
        character.attribute = this._getCharacterAttribute(mstSvt);
        character.alignment = []; // TOOD Populate this.
        character.traits = []; // TODO Populate this.
        character.gender = this._getCharacterGender(mstSvt);
        character.starRate = mstSvt.starRate;
        character.deathRate = mstSvt.deathRate;

        const mstSvtLimitBucket = this._mstSvtLimitMapBySvtId[mstSvt.id];
        if (!mstSvtLimitBucket) {
            // TODO Log this.
        }
        const mstSvtLimit = mstSvtLimitBucket[0]; // This will always exist if `mstSvtLimitBucket` exists.
        character.hpBase = mstSvtLimit.hpBase;
        character.hpMax = mstSvtLimit.hpMax;
        character.atkBase = mstSvtLimit.atkBase;
        character.atkMax = mstSvtLimit.atkMax;
        character.criticalWeight = mstSvtLimit.criticalWeight;

        if (mstSvt.illustratorId > 1) {
            character.metadata.illustratorId = mstSvt.illustratorId;
        }
        if (mstSvt.cvId > 1) {
            character.metadata.cvId = mstSvt.cvId;
        }
    }

    /**
     * Helper method for parsing card data from the given `mstSvt` object and
     * populating the `cards` field in the `GameServant` object.
     */
    private _populateServantCards(mstSvt: KazemaiGameDataMstSvt, servant: GameServant) {
        const mstSvtCardSubMap = this._mstSvtCardMapBySvtId[mstSvt.id];
        servant.cards = {
            deck: this._getServantDeck(mstSvt),
            hits: {
                // 1 = Arts, 2 = Buster, 3 = Quick, 4 = Extra
                buster: mstSvtCardSubMap[2].normalDamage,
                arts: mstSvtCardSubMap[1].normalDamage,
                quick: mstSvtCardSubMap[3].normalDamage,
                extra: mstSvtCardSubMap[4].normalDamage,
            }
        };
    }

    /**
     * Helper method for parsing the active skills from the `mstSvtSkill` data that
     * is associated with the given `mstSvt` object and populating the 
     * `activeSkills` field in the `GameServant` object.
     */
    private _populateServantActiveSkills(mstSvt: KazemaiGameDataMstSvt, servant: GameServant) {
        const activeSkills: any = {};

        /*
         * Retrieve the `mstSvtSkill` bucket for the servant using the `svtId` value
         * and use it to update the `activeSkills` object
         */
        const mstSvtSkillBucket = this._mstSvtSkillMapBySvtId[mstSvt.id];
        for (const mstSvtSkill of mstSvtSkillBucket) {
            const skill: GameObjectSkill = {
                skillId: mstSvtSkill.skillId,
                effects: [] // TODO Importing this from Kazemai data is currently not supported.
            };
            const skillNumber = mstSvtSkill.num; // This should only be 1, 2, or 3 for servants.
            const isUpgraded = mstSvtSkill.strengthStatus === 2;
            // Add unlock conditions if its not the first base skill.
            if (skillNumber !== 1 || isUpgraded) {
                (skill as GameObjectSkill & GameObjectSkillUnlockable).unlock = {
                    ascension: mstSvtSkill.condLimitCount,
                    quest: mstSvtSkill.condQuestId !== 0
                };
            }
            // Add the skill to the target path in the `activeSkills` object.
            const skillNumberPath = `skill${skillNumber}`;
            let targetSkillSlot = activeSkills[skillNumberPath];
            if (!targetSkillSlot) {
                targetSkillSlot = activeSkills[skillNumberPath] = {};
            }
            targetSkillSlot[isUpgraded ? 'upgrade' : 'base'] = skill;
        }

        /*
         * Retrieve the skill upgrade data bucket for the servant using the servant's
         * `combineSkillId` value and use it to populate the upgrade data for each
         * upgrade level. It is assumed that indexes 1 thru 9 of the bucket are always
         * populated.
         */
        const mstCombineSkillSubMap = this._mstCombineSkillMapById[mstSvt.combineSkillId];
        for (let i = 1; i <= 9; i++) {
            const mstCombineSkill = mstCombineSkillSubMap[i];
            const upgrade = this._parseMstCombineObject(mstCombineSkill);

            // Add the upgrade to the target path in the `activeSkills` object.
            const path = `upgrade${i}`;
            activeSkills[path] = upgrade;
        }

        servant.activeSkills = activeSkills;
    }

    /**
     * Helper method for parsing noble phantasm data from the `mstSvtTreasure` data
     * that is associated with the given `mstSvt` object and populating the 
     * `noblePhantasm` field in the `GameServant` object.
     */
    private _populateServantNoblePhantasm(mstSvt: KazemaiGameDataMstSvt, servant: GameServant) {
        /*
         * Retrieve the `mstSvtTreasureDevice` bucket for the servant using the `id` of
         * the provided `mstSvt` and use it to update the `noblePhantasm` object. 
         */
        const mstSvtTreasureDeviceSubMap = this._mstSvtTreasureDeviceMapBySvtId[mstSvt.id];

        /*
         * Some of the non-playable servants do not have noble phantasm data. If this
         * is the case, just return.
         */
        if (!mstSvtTreasureDeviceSubMap) {
            if (mstSvt.type !== 9) {
                // TODO This should never happen, but if it does, log it.
            }
            return;
        }

        // Strength status 0 and 1 = base, strength status 2 = upgraded
        const mstSvtTreasureDeviceBase = mstSvtTreasureDeviceSubMap[0] || mstSvtTreasureDeviceSubMap[1];
        const mstSvtTreasureDeviceUpgrade = mstSvtTreasureDeviceSubMap[2];

        if (!mstSvtTreasureDeviceBase) {
            // TODO Log this
        }
        const base = this._parseMstSvtTreasureDeviceObject(mstSvtTreasureDeviceBase);

        let upgrade: GameServantNoblePhantasm & GameObjectSkillUnlockable;
        if (mstSvtTreasureDeviceUpgrade) {
            upgrade = this._parseMstSvtTreasureDeviceObject(mstSvtTreasureDeviceUpgrade) as any;
            upgrade.unlock = {
                ascension: 0,
                quest: mstSvtTreasureDeviceUpgrade.condQuestId !== 0
            };
        }

        servant.noblePhantasm = { base, upgrade };
    }

    /**
     * Helper method for parsing passive skills from the given `mstSvt` object and
     * populating the `passiveSkills` field in the `GameServant` object.
     */
    private _populateServantPassiveSkills(mstSvt: KazemaiGameDataMstSvt, servant: GameServant) {
        if (!mstSvt.classPassive) {
            servant.passiveSkills = [];
        }
        servant.passiveSkills = mstSvt.classPassive?.map(classPassive => {
            return {
                skillId: classPassive,
                effects: [] // TODO Importing this from Kazemai data is currently not supported.
            };
        });
    }

    /**
     * Helper method for parsing ascension upgrade data from the given `mstSvt`
     * object and populating the `passiveSkills` field in the `GameServant` object.
     */
    private _populateServantAscensions(mstSvt: KazemaiGameDataMstSvt, servant: GameServant) {
        const ascensions: any = {};

        const mstCombineLimitSubMap = this._mstCombineLimitMapById[mstSvt.combineLimitId];
        if (!mstCombineLimitSubMap) {
            // TODO This should never happen, but if it does, log it.
            return;
        }
        for (let i = 0; i < 4; i++) {
            const mstCombineLimit = mstCombineLimitSubMap[i];
            if (!mstCombineLimit) {
                // TODO Log this.
                continue;
            }
            const upgrade = this._parseMstCombineObject(mstCombineLimit);
            const ascension: GameServantAscension = { upgrade };
            ascensions[`ascension${i}`] = ascension;
        }
        /*
         * Note that there should also be a fifth entry (at i == 5), but it is for
         * palingenesis (grailing) rather than ascension. As such, it is not included
         * in the import.
         */

        servant.ascensions = ascensions;
    }

    /**
     * Helper method for parsing the display stats from the `mstSvtLimit` data that
     * is associated with the given `mstSvt` object and populating the `stats`
     * field in the `GameServant` object.
     */
    private _populateServantStats(mstSvt: KazemaiGameDataMstSvt, servant: GameServant) {
        const mstSvtLimitBucket = this._mstSvtLimitMapBySvtId[mstSvt.combineLimitId];
        /*
         * Some of the non-playable servants do not have noble phantasm data. If this
         * is the case, just return.
         */
        if (!mstSvtLimitBucket) {
            if (mstSvt.type !== 9) {
                // TODO This should never happen, but if it does, log it.
            }
            return;
        }
        /*
         * With the exception of Mash, all the ascension levels contain the same stat
         * values. The first element in the bucket is used for convenience.
         */
        const mstSvtLimit = mstSvtLimitBucket[0];
        servant.stats = {
            power: mstSvtLimit.power,
            defense: mstSvtLimit.defense,
            agility: mstSvtLimit.agility,
            magic: mstSvtLimit.magic,
            luck: mstSvtLimit.luck,
            noblePhantasm: mstSvtLimit.treasureDevice
        };
    }


    /**
     * Helper method for parsing the bond points from the `mstFriendship` data that
     * is associated with the given `mstSvt` object and populating the `bond` field
     * in the `GameServant` object.
     */
    private _populateServantBond(mstSvt: KazemaiGameDataMstSvt, servant: GameServant) {
        const friendshipId = mstSvt.friendshipId;
        const mstFriendshipSubMap = this._mstFriendshipMapById[friendshipId];
        if (!mstFriendshipSubMap) {
            // TODO Log this
            return;
        }
        /*
         * With the exception of Mash, all servants should have a max bond level of 15
         * (Mash has a max bond level of 5). However, only the first 10 levels are
         * imported, since levels 1 thru 15 have the same requirements regardless of
         * servant.
         */
        const max = mstSvt.type === 2 ? 5 : 10;
        const points: number[] = [];
        for (let rank = 0; rank < max; rank++) {
            const mstFriendship = mstFriendshipSubMap[rank];
            if (!mstFriendship) {
                // TODO Log this
                continue;
            }
            points.push(mstFriendship.friendship);
        }

        servant.bond = { bondId: friendshipId, max, points };
    }

    /**
     * Helper method for parsing an `mstCombine` object and converting it into a
     * `GameServantUpgrade` object.
     */
    private _parseMstCombineObject(mstCombine: KazemaiGameDataMstCombineLimit | KazemaiGameDataMstCombineSkill): GameServantUpgrade {
        const materials = [];
        for (let i = 0, length = mstCombine.itemIds.length; i < length; i++) {
            materials.push({
                itemId: mstCombine.itemIds[i],
                quantity: mstCombine.itemNums[i]
            });
        }
        return { qp: mstCombine.qp, materials };
    }

    /**
     * Helper method for parsing an `mstSvtTreasureDevice` object and converting it
     * into a `GameServantNoblePhantasm` object.
     */
    private _parseMstSvtTreasureDeviceObject(mstSvtTreasureDevice: KazemaiGameDataMstSvtTreasureDevice): GameServantNoblePhantasm {
        const treasureDeviceId = mstSvtTreasureDevice.treasureDeviceId;

        /*
         * Retrieve the `mstTreasureDevice` and `mstTreasureDeviceDetail` data for the
         * noble phantasm.
         */
        const mstTreasureDevice = this._mstTreasureDeviceMapById[treasureDeviceId];
        const mstTreasureDeviceDetail = this._mstTreasureDeviceDetailMapById[treasureDeviceId];

        const cardType = this._getCharacterCardType(mstSvtTreasureDevice);

        let rankLower = GameSkillRank.None, rankUpper = GameSkillRank.None;
        if (mstTreasureDevice.rank) {
            const rank = UnicodeUtils.convertUnicodeToAscii(mstTreasureDevice.rank).split(/~/);
            rankLower = this._parseSkillRank(rank[0]);
            rankUpper = this._parseSkillRank(rank[1]);
        }

        return {
            treasureDeviceId,
            nameJp: mstTreasureDevice?.name,
            nameJpRuby: mstTreasureDevice?.ruby,
            rank: rankLower,
            rankUpper: rankUpper,
            descriptionJp: mstTreasureDeviceDetail?.detail, // TODO Descriptions have placeholders that need to be handled.
            classificationJp: mstTreasureDevice?.typeText,
            cardType,
            hits: mstSvtTreasureDevice.damage,
            effects: [] // TODO Importing this from Kazemai data is currently not supported.
        };
    }

    /**
     * Helper method for extracting a `GameCharacterClass` enum constant from the
     * given  `mstSvt` object. Defaults to `GameCharacterClass.Unknown` if the
     * value could not be retrieved.
     */
    private _getCharacterClass(mstSvt: KazemaiGameDataMstSvt): GameCharacterClass {
        return KazemaiGameDataParser.CharacterClassMap[mstSvt.classId] || GameCharacterClass.Unknown;
    }

    /**
     * Helper method for extracting a `GameCharacterAttribute` enum constant from
     * the given `mstSvt` object. Defaults to `GameCharacterAttribute.Earth` if
     * the value could not be retrieved.
     */
    private _getCharacterAttribute(mstSvt: KazemaiGameDataMstSvt): GameCharacterAttribute {
        return KazemaiGameDataParser.CharacterAttributeMap[mstSvt.attri] || GameCharacterAttribute.Earth;
    }

    /**
     * Helper method for extracting a `GameCharacterGender` enum constant from the
     * given  `mstSvt` object. Defaults to `GameCharacterGender.None` if the value
     * could not be retrieved.
     */
    private _getCharacterGender(mstSvt: KazemaiGameDataMstSvt): GameCharacterGender {
        return KazemaiGameDataParser.CharacterGenderMap[mstSvt.genderType] || GameCharacterGender.None;
    }

    /**
     * Helper method for extracting a `GameCharacterCardType` enum constant from
     * the given `mstSvtTreasureDevice` object.
     */
    private _getCharacterCardType(mstSvtTreasureDevice: KazemaiGameDataMstSvtTreasureDevice): GameCharacterCardType {
        return KazemaiGameDataParser.CharacterCardTypeMap[mstSvtTreasureDevice.cardId];
    }

    /**
     * Helper method for extracting a `GameServantGrowthRate` enum constant from
     * the given `mstSvt` object.
     * 
     * Each growth type is represented by 5 sequential `expType` values. For
     * example, values `1` thru `5` is the linear growth type, while values `6`
     * thru `10` are the reverse S type. The complete list is:
     * - `1`-`5`: Linear
     * - `6`-`10`: Reverse S
     * - `11`-`15`: S
     * - `21`-`25`: Semi-Reverse S
     * - `26`-`30` Semi-S
     * 
     * There is also an additional value `9999` which does not represent any growth
     * rate type.
     * 
     * Within each of these ranges, each value represents a distinct servant rarity
     * for that growth rate type. For example, for the reverse S growth type (values
     * `6` thru `10`):
     * - `6`: 1* rarity
     * - `7`: 2* rarity
     * - `8`: 3* rarity
     * - `9`: 4* rarity
     * - `10`: 5* rarity
     * 
     * This method is only extracting the growth rate curve type; the rarity level
     * is ignored.
     */
    private _getServantGrowthRate(mstSvt: KazemaiGameDataMstSvt): GameServantGrowthRate {
        const expType = mstSvt.expType;
        if (expType <= 5) {
            return GameServantGrowthRate.Linear;
        }
        if (expType <= 10) {
            return GameServantGrowthRate.ReverseS;
        }
        if (expType <= 15) {
            return GameServantGrowthRate.S;
        }
        // Values 16 thru 20 don't exist.
        if (expType <= 25) {
            return GameServantGrowthRate.SemiReverseS;
        }
        if (expType <= 30) {
            return GameServantGrowthRate.SemiS;
        }
        return null;
    }

    /**
     * Helper method for extracting a `GameServantDeck` enum constant from the
     * `mstSvt` object. Assumes that the input data is always valid.
     */
    private _getServantDeck(mstSvt: KazemaiGameDataMstSvt): GameServantDeck {
        const cardIds = mstSvt.cardIds;
        /*
         * Possible cardId values: 1 = Arts, 2 = Buster, 3 = Quick
         * 
         * Only variables are the middle three cards, since the first card is always
         * quick and the last card is always buster for a valid input.
         */
        const cards = cardIds[3] * 100 + cardIds[2] * 10 + cardIds[1];
        switch (cards) {
            case 221:
                return GameServantDeck.BBBAQ;
            case 211:
                return GameServantDeck.BBAAQ;
            case 213:
                return GameServantDeck.BBAQQ;
            case 111:
                return GameServantDeck.BAAAQ;
            case 113:
                return GameServantDeck.BAAQQ;
            case 133:
                return GameServantDeck.BAQQQ;
        }
    }

    //#endregion


    //#region Shared utility/helper methods

    private _parseSkillRank(rank: string): GameSkillRank {
        if (!rank || rank === 'なし') {
            return GameSkillRank.None;
        }
        rank = UnicodeUtils.convertUnicodeToAscii(rank);
        if (rank.length > 1) {
            rank = rank.replace(/\+/g, 'Plus');
            rank = rank.replace(/\-/g, 'Minus');
        }
        console.log(rank, (GameSkillRank as any)[rank]);
        return (GameSkillRank as any)[rank] || GameSkillRank.None;
    }

    //#endregion

}
