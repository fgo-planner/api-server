import { GameCharacter, GameCharacterAttribute, GameCharacterClass, GameCharacterGender, GameCraftEssence, GameEnhancementCard, GameNpc, GameObject, GameServant, GameServantDeck, GameServantUpgrade, GameSpiritOrigin, GameSpiritOriginCollection, GameObjectSkill, GameObjectSkillUnlockable } from 'data/types';
import { GameDataImportParser } from '../game-data-import-parser.class';
import { KazemaiGameData, KazemaiGameDataMstCombineLimit, KazemaiGameDataMstCombineSkill, KazemaiGameDataMstSkill, KazemaiGameDataMstSkillDetail, KazemaiGameDataMstSvt, KazemaiGameDataMstSvtCard, KazemaiGameDataMstSvtLimit, KazemaiGameDataMstSvtSkill } from './kazemai-game-data.type';

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
    private static readonly CharacterAttributeMap  = {
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
    private static readonly CharacterGenderMap  = {
        1: GameCharacterGender.Male,
        2: GameCharacterGender.Female,
        3: GameCharacterGender.None
    } as { [key: number]: GameCharacterGender };

    //#endregion

    //#region Data lookup maps

    private readonly _mstCombineSkillMapById: { [key: number]: KazemaiGameDataMstCombineSkill[] } = {};

    private readonly _mstCombineLimitMapById: { [key: number]: KazemaiGameDataMstCombineLimit[] } = {};

    private readonly _mstSvtCardMapBySvtId: { [key: number]: KazemaiGameDataMstSvtCard[] } = {};

    private readonly _mstSvtLimitMapBySvtId: { [key: number]: KazemaiGameDataMstSvtLimit } = {};

    private readonly _mstSvtSkillMapBySvtId: { [key: number]: KazemaiGameDataMstSvtSkill[] } = {};

    private readonly _mstSkillMapById: { [key: number]: KazemaiGameDataMstSkill } = {};

    private readonly _mstSkillDetailMapById: { [key: number]: KazemaiGameDataMstSkillDetail } = {};

    //#endregion

    constructor(data: KazemaiGameData) {
        super(data);
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
         * Generate the map of `mstCombineSkill` objects by their `id` values. There
         * are are multiple entries for each `id`, so a bucket (array) is created for
         * each `id` value to store its entries. The index in the bucket is computed
         * by the `skillLv` field in the `mstCombineSkill` object.
         */
        for (const mstCombineSkill of this._data.mstCombineSkill) {
            let bucket = this._mstCombineSkillMapById[mstCombineSkill.id];
            if (!bucket) {
                bucket = this._mstCombineSkillMapById[mstCombineSkill.id] = [];
            }
            /*
             * Possible `skillLv` values are 1 thru 9, inclusive.
             */ 
            bucket[mstCombineSkill.skillLv] = mstCombineSkill; // Index 0 will always be empty.
        }

        /*
         * Generate the map of `mstCombineSkill` objects by their `id` values. There
         * are are multiple entries for each `id`, so a bucket (array) is created for
         * each `id` value to store its entries. The index in the bucket is computed
         * by the `skillLv` field in the `mstCombineSkill` object.
         */
        for (const mstCombineLimit of this._data.mstCombineLimit) {
            let bucket = this._mstCombineLimitMapById[mstCombineLimit.id];
            if (!bucket) {
                bucket = this._mstCombineLimitMapById[mstCombineLimit.id] = [];
            }
            /*
             * Possible `svtLimit` values are 0 thru 4, inclusive.
             */ 
            bucket[mstCombineLimit.svtLimit] = mstCombineLimit; // Index 0 will always be empty.
        }

        /*
         * Generate the map of `mstSvtCard` objects by their `svtId` values. There are
         * are multiple entries for each `svtId`, so a bucket (array) is created for
         * each `svtId` value to store its entries. The index in the bucket is computed
         * by the `cardId` field in the `mstSvtCard` object.
         */
        for (const mstSvtCard of this._data.mstSvtCard) {
            let bucket = this._mstSvtCardMapBySvtId[mstSvtCard.svtId];
            if (!bucket) {
                bucket = this._mstSvtCardMapBySvtId[mstSvtCard.svtId] = [];
            }
            /*
             * Possible `cardId` values are 1, 2, 3, or 4 for servants, and 10, 11 for
             * everything else. Assume only one of each `cardId` value for a `svtId`.
             */ 
            if (mstSvtCard.cardId < 10) {
                bucket[mstSvtCard.cardId] = mstSvtCard; // Index 0 will always be empty.
            } else {
                bucket[mstSvtCard.cardId - 10] = mstSvtCard;
            }
        }

        /*
         * Generate the map of `mstSvtLimit` objects by their `svtId` value.
         *
         * There are duplicate `svtId` keys in the dataset. To be exact, there is an
         * entry for each ascension level of a servant. However, afaik the values
         * between each ascension are always the same except for `lvMax`. The only
         * exception to this is Mash, whose rarity (and thus stats) changes with
         * ascension levels. Since the application current doesn't handle this special
         * for Mash, this can be ignored for now.
         */
        for (const mstSvtLimit of this._data.mstSvtLimit) {
            this._mstSvtLimitMapBySvtId[mstSvtLimit.svtId] = mstSvtLimit;
        }

        /*
         * Generate the map of `mstSvtLimit` objects by their `svtId` values. There are
         * multiple entries for each `svtId`, so a bucket (array) is created for each
         * `svtId` value to store its entries.
         */
        for (const mstSvtSkill of this._data.mstSvtSkill) {
            let bucket = this._mstSvtSkillMapBySvtId[mstSvtSkill.svtId];
            if (!bucket) {
                bucket = this._mstSvtSkillMapBySvtId[mstSvtSkill.svtId] = [];
            }
            bucket.push(mstSvtSkill);
        }

        for (const mstSkill of this._data.mstSkill) {
            this._mstSkillMapById[mstSkill.id] = mstSkill;
        }

        for (const mstSkillDetail of this._data.mstSkillDetail) {
            this._mstSkillDetailMapById[mstSkillDetail.id] = mstSkillDetail;
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
     * Populates the given `GameSpiritOrigin` object from the given `mstSvt` object.
     */
    private _populateSpiritOriginFromMstSvtObject(mstSvt: KazemaiGameDataMstSvt, spiritOrigin: GameSpiritOrigin) {
        spiritOrigin.gameRegions = {
            JP: true
        };
        spiritOrigin.rarity = this._mstSvtLimitMapBySvtId[mstSvt.id]?.rarity;
        spiritOrigin.nameJpRuby = mstSvt.ruby;
        spiritOrigin.sell = {
            qp: mstSvt.sellQp,
            manaPrisms: mstSvt.sellMana,
            rarePrisms: mstSvt.sellRarePri,
        };

        /*
         * Type 3 is embers, type 7 is fous, which are not part of a collection.
         */
        if (mstSvt.type === 3 || mstSvt.type === 7) {
            this._populateEnhancementCardFromMstSvtObject(mstSvt, spiritOrigin as GameEnhancementCard);
            return;
        }

        /*
         * The remaining types should all be part of a collection.
         */
        const spiritOriginCollection = spiritOrigin as GameSpiritOriginCollection;
        spiritOriginCollection.collectionNo = mstSvt.collectionNo;
        if (mstSvt.illustratorId > 1) {
            spiritOriginCollection.metadata.illustratorId = mstSvt.illustratorId;
        }

        /*
         * Type 6 is craft essences. The remaining types (1, 2, 9) are servants.
         */
        if (mstSvt.type === 6) {
            this._populateCraftEssenceFromMstSvtObject(mstSvt, spiritOriginCollection as GameCraftEssence);
        } else {
            this._populateServantFromMstSvtObject(mstSvt, spiritOriginCollection as GameServant);
        }
    }

    /**
     * Populates the given `GameEnhancementCard` object from the given `mstSvt` object.
     */
    private _populateEnhancementCardFromMstSvtObject(mstSvt: KazemaiGameDataMstSvt, enhancementCard: GameEnhancementCard) {
        enhancementCard.class = mstSvt.classId === 1001 ? 'All' : this._getCharacterClass(mstSvt);
        // TODO Implement the rest of this
    }

    /**
     * Populates the given `GameCraftEssence` object from the given `mstSvt` object.
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

        this._populateCharacterFromMstSvtObject(mstSvt, servant);
        servant.cost = mstSvt.cost;
        this._populateServantCards(mstSvt, servant);

        /*
         * Type 9 servants are neither summonable nor playable. These servants do
         * not have active and passive skills. They also cannot be ascended.
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
            this._populateServantActiveSkills(mstSvt.id, servant);
        }

        this._result.servants.push(servant); // Insert into result
    }

    /**
     * Populates the given `GameNpc` object from the given `mstSvt` object.
     */
    private _populateNpcFromMstSvtObject(mstSvt: KazemaiGameDataMstSvt, npc: GameNpc) {
        this._populateCharacterFromMstSvtObject(mstSvt, npc);
        npc._id = mstSvt.id;
        npc.nameJp = mstSvt.name;
        npc.battleNameJp = mstSvt.battleName;
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
        character.gender = this._getGameCharacterGender(mstSvt);
        character.starRate = mstSvt.starRate;
        character.deathRate = mstSvt.deathRate;

        const mstSvtLimit = this._mstSvtLimitMapBySvtId[mstSvt.id];
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
     * Helper method for parsing card information from the given `mstSvt` object and
     * populating the `cards` field in the `GameServant` object.
     */
    private _populateServantCards(mstSvt: KazemaiGameDataMstSvt, servant: GameServant) {
        const mstSvtCardBucket = this._mstSvtCardMapBySvtId[mstSvt.id];
        servant.cards = {
            deck: this._getGameServantDeck(mstSvt),
            hits: {
                // 1 = Arts, 2 = Buster, 3 = Quick, 4 = Extra
                buster: mstSvtCardBucket[2].normalDamage,
                arts: mstSvtCardBucket[1].normalDamage,
                quick: mstSvtCardBucket[3].normalDamage,
                extra: mstSvtCardBucket[4].normalDamage,
            }
        };
    }

    /**
     * Helper method for parsing active skills for a servant with the given `svtId`
     * and populating the `activeSkills` field in the `GameServant` object.
     */
    private _populateServantActiveSkills(svtId: number, servant: GameServant) {
        const activeSkills: any = {};

        /*
         * Retrieve the `mstSvtSkill` bucket for the servant using the provided `svtId`
         * and use it to update the `activeSkills` object
         */
        const mstSvtSkillBucket = this._mstSvtSkillMapBySvtId[svtId];
        for (const mstSvtSkill of mstSvtSkillBucket) {
            const skill: any = {
                skillId: mstSvtSkill.skillId,
                effects: [] // TODO Importing this from Kazemai data is currently not supported.
            };
            const slot = mstSvtSkill.num; // This should only be 1, 2, or 3 for servants.
            const upgraded = mstSvtSkill.strengthStatus === 2;
            // Add unlock conditions if its not the base first skill.
            if (slot !== 1 || upgraded) {
                this._populateSkillUnlockConditions(mstSvtSkill, skill);
            }
            // Add the skill to the target path in the `activeSkills` object.
            const path1 = `skill${slot}`;
            const path2 = upgraded ? 'upgrade' : 'base';
            let targetSkill = activeSkills[path1];
            if (!targetSkill) {
                targetSkill = activeSkills[path1] = {};
            }
            targetSkill[path2] = skill;
        }

        /*
         * Retrieve the skill upgrade data bucket for the servant using the provided
         * `svtId` and use it to populate the upgrade data for each upgrade level.
         * It is assumed that indexes 1 thru 9 of the bucket are always populated.
         */
        const mstCombineSkillBucket = this._mstCombineSkillMapById[svtId];
        for (let i = 1; i <= 9; i++) {
            const mstCombineSkill = mstCombineSkillBucket[i];
            const upgrade = this._parseMstCombineObject(mstCombineSkill);

            // Add the upgrade to the target path in the `activeSkills` object.
            const path = `upgrade${i}`;
            activeSkills[path] = upgrade;
        }

        servant.activeSkills = activeSkills;
    }

    /**
     * Helper method for parsing noble phantasm for a servant with the given
     * `svtId` and populating the `noblePhantasm` field in the `GameServant`
     * object.
     */
    private _populateServantNoblePhantasm(svtId: number, servant: GameServant) {
        // TODO Implement this
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
     * Helper method for parsing skill unlock conditions and populating the 
     * unlock` field in the `GameObjectSkillUnlockable` object.
     */
    private _populateSkillUnlockConditions(mstSvtSkill: KazemaiGameDataMstSvtSkill, skill: GameObjectSkillUnlockable) {
        skill.unlock = {
            ascension: mstSvtSkill.condLimitCount,
            quest: mstSvtSkill.condQuestId !== 0
        };
    }

    /**
     * Helper method for extracting a `GameCharacterClass` enum constant from the
     * `mstSvt` object. Defaults to `GameCharacterClass.Unknown` if the value could
     * not be retrieved.
     */
    private _getCharacterClass(mstSvt: KazemaiGameDataMstSvt): GameCharacterClass {
        return KazemaiGameDataParser.CharacterClassMap[mstSvt.classId] || GameCharacterClass.Unknown;
    }

    /**
     * Helper method for extracting a `GameCharacterAttribute` enum constant from
     * the `mstSvt` object. Defaults to `GameCharacterAttribute.Earth` if the value
     * could not be retrieved.
     */
    private _getCharacterAttribute(mstSvt: KazemaiGameDataMstSvt): GameCharacterAttribute {
        return KazemaiGameDataParser.CharacterAttributeMap[mstSvt.attri] || GameCharacterAttribute.Earth;
    }

    /**
     * Helper method for extracting a `GameCharacterGender` enum constant from the
     * `mstSvt` object. Defaults to `GameCharacterGender.None` if the value could
     * not be retrieved.
     */
    private _getGameCharacterGender(mstSvt: KazemaiGameDataMstSvt): GameCharacterGender {
        return KazemaiGameDataParser.CharacterGenderMap[mstSvt.genderType] || GameCharacterGender.None;
    }

    /**
     * Helper method for extracting a `GameServantDeck` enum constant from the
     * `mstSvt` object. Assumes that the input data is always valid.
     */
    private _getGameServantDeck(mstSvt: KazemaiGameDataMstSvt): GameServantDeck {
        const cardIds = mstSvt.cardIds;
        /*
         * Possible cardId values: 1 = Arts, 2 = Buster, 3 = Quick
         * 
         * Only variables are the middle three cards, since the first card is always
         * quick and the last card is always buster for a valid input.
         */
        const cards = cardIds[3] * 100  + cardIds[2] * 10 + cardIds[1];
        switch(cards) {
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

}