import { ExternalLink, GameItem, GameItemBackground, GameItemQuantity, GameItemUsage, GameServant, GameServantAttribute, GameServantCardType, GameServantClass, GameServantCostume, GameServantEnhancement, GameServantGender, GameServantGrowthCurve, GameServantNoblePhantasm, GameServantNoblePhantasmTarget, GameServantRarity, GameServantSkillMaterials, GameSoundtrack } from '@fgo-planner/data';
import axios from 'axios';
import { GameDataImportLogger, ReadonlyRecord } from 'internal';
import { Service } from 'typedi';
import { AtlasAcademyAttribute } from './atlas-academy-attribute.type';
import { AtlasAcademyBasicServant } from './atlas-academy-basic-servant.type';
import { AtlasAcademyDataImportConstants as Constants } from './atlas-academy-data-import.constants';
import { AtlasAcademyNiceBgmEntity } from './atlas-academy-nice-bgm-entity.type';
import { AtlasAcademyNiceCardType } from './atlas-academy-nice-card-type.type';
import { FunctionType } from './atlas-academy-nice-function.type';
import { AtlasAcademyNiceGender } from './atlas-academy-nice-gender.type';
import { AtlasAcademyNiceItemAmount } from './atlas-academy-nice-item-amount.type';
import { AtlasAcademyNiceItemBGType } from './atlas-academy-nice-item-bg-type.type';
import { AtlasAcademyNiceItemType } from './atlas-academy-nice-item-type.type';
import { AtlasAcademyNiceItemUse } from './atlas-academy-nice-item-use.type';
import { AtlasAcademyNiceItem } from './atlas-academy-nice-item.type';
import { AtlasAcademyNiceLvlUpMaterial } from './atlas-academy-nice-lvl-up-material.type';
import { AscensionMaterialKey, AtlasAcademyNiceServant, SkillMaterialKey } from './atlas-academy-nice-servant.type';
import { AtlasAcademyNiceTd } from './atlas-academy-nice-td.type';
import { AtlasAcademySvtClass } from './atlas-academy-svt-class.type';

type ServantEnData = AtlasAcademyBasicServant & Pick<AtlasAcademyNiceServant, 'profile'>;

@Service()
export class AtlasAcademyDataImportService {

    //#region Enum maps

    /**
     * Maps the `AtlasAcademySvtClass` values to the `GameServantClass` enum
     * values.
     */
    private static readonly _ServantClassMap = {
        'saber': GameServantClass.Saber,
        'archer': GameServantClass.Archer,
        'lancer': GameServantClass.Lancer,
        'rider': GameServantClass.Rider,
        'caster': GameServantClass.Caster,
        'assassin': GameServantClass.Assassin,
        'berserker': GameServantClass.Berserker,
        'shielder': GameServantClass.Shielder,
        'ruler': GameServantClass.Ruler,
        'alterEgo': GameServantClass.AlterEgo,
        'avenger': GameServantClass.Avenger,
        'demonGodPillar': GameServantClass.Unknown,
        'moonCancer': GameServantClass.MoonCancer,
        'foreigner': GameServantClass.Foreigner,
        'grandCaster': GameServantClass.Caster,
        'beastII': GameServantClass.BeastII,
        'beastI': GameServantClass.BeastI,
        'beastIIIR': GameServantClass.BeastIIIR,
        'beastIIIL': GameServantClass.BeastIIIL,
        'beastUnknown': GameServantClass.Unknown,
        'pretender': GameServantClass.Pretender,
        'unknown': GameServantClass.Unknown,
        'ALL': GameServantClass.Unknown // TODO Implement 'All' class
    } as ReadonlyRecord<AtlasAcademySvtClass, GameServantClass>;

    /**
     * Maps the `AtlasAcademyNiceGender` values to the `GameServantGender` enum
     * values.
     */
    private static readonly _ServantGenderMap = {
        'male': GameServantGender.Male,
        'female': GameServantGender.Female,
        'unknown': GameServantGender.None
    } as ReadonlyRecord<AtlasAcademyNiceGender, GameServantGender>;

    /**
     * Maps the `AtlasAcademyAttribute` values to the `GameServantAttribute` enum
     * values.
     */
    private static readonly _ServantAttributeMap = {
        'human': GameServantAttribute.Man,
        'sky': GameServantAttribute.Sky,
        'earth': GameServantAttribute.Earth,
        'star': GameServantAttribute.Star,
        'beast': GameServantAttribute.Beast
    } as ReadonlyRecord<AtlasAcademyAttribute, GameServantAttribute>;

    /**
     * Maps the `AtlasAcademyNiceCardType` values to the `GameServantCardType` enum
     * values.
     */
    private static readonly _ServantCardTypeMap = {
        'buster': GameServantCardType.Buster,
        'arts': GameServantCardType.Arts,
        'quick': GameServantCardType.Quick
    } as ReadonlyRecord<AtlasAcademyNiceCardType, GameServantCardType>;

    /**
     * Maps the `AtlasAcademyNiceItemBGType` values to the `GameItemBackground`
     * enum values.
     */
    private static readonly _ItemBackgroundMap = {
        'zero': GameItemBackground.None,
        'bronze': GameItemBackground.Bronze,
        'silver': GameItemBackground.Silver,
        'gold': GameItemBackground.Gold,
        'questClearQPReward': GameItemBackground.QPReward
    } as ReadonlyRecord<AtlasAcademyNiceItemBGType, GameItemBackground>;

    /**
     * Maps the `AtlasAcademyNiceItemUse` values to the `GameItemUsage`
     * enum values.
     */
    private static readonly _ItemUsageMap = {
        'skill': GameItemUsage.Skill,
        'ascension': GameItemUsage.Ascension,
        'costume': GameItemUsage.Costume
    } as ReadonlyRecord<AtlasAcademyNiceItemUse, GameItemUsage>;

    //#endregion


    //#region Additional data

    /**
     * Types of items that are imported even if they don't have any enhancement
     * uses defined.
     */
    private static readonly _AdditionalItemImportTypes = new Set<AtlasAcademyNiceItemType>([
        'questRewardQp',    // QP
        'chargeStone',      // Saint quartz
        'gachaTicket',      // Summon tickets
        'friendPoint',      // Friend points
        'anonymous',        // USOs
        'tdLvUp'            // Statues and grails
    ]);

    //#endregion


    //#region Servant import methods

    /**
     * Retrieves servant data from the Atlas Academy API and converts it into a
     * list of `GameServant` objects.
     * 
     * @param skipIds The set of IDs to omit from the result.
     */
    async getServants(logger?: GameDataImportLogger): Promise<Array<GameServant>> {
        /*
         * Retrieve 'nice' JP servant data with lore and English names.
         */
        const niceServants = await this._getNiceServants('JP', logger);

        /*
         * Retrieve 'nice' NA servant data with lore an convert it into a lookup map.
         * This servant data will be used as the source for additional English strings
         * (costume names, etc).
         * 
         * This is needed because as of 6/13/2021, the JP servant data with English
         * names does not include English costume names.
         */
        const niceServantsNa = await this._getNiceServants('NA', logger);
        const servantEngMap: Record<number, ServantEnData> = {};
        for (const servant of niceServantsNa) {
            servantEngMap[servant.collectionNo] = servant;
        }

        /*
         * Convert the servant data into `GameServant` objects.
         */
        try {
            const servants = niceServants
                .map(servant => this._transformServantData(servant, servantEngMap, logger))
                .filter(servant => servant != null) as Array<GameServant>;
            return servants;
        } catch (e) {
            console.error(e);
        }

        return [];
    }

    /**
     * Retrieves the pre-generated nice servant data with lore from the Atlas
     * Academy API. Always retrieves the data with English names.
     */
    private async _getNiceServants(region: 'NA' | 'JP', logger?: GameDataImportLogger): Promise<Array<AtlasAcademyNiceServant>> {
        const filename = region === 'NA' ? Constants.NiceServantsFilename : Constants.NiceServantsEnglishFilename;
        const url = `${Constants.BaseUrl}/${Constants.ExportPath}/${region}/${filename}`;
        logger?.info(`Calling ${url}`);
        const response = await axios.get(url);
        // TODO Handle errors
        return response.data;
    }

    /**
     * Converts a Atlas Academy `NiceServant` object into a `GameServant` object.
     */
    private _transformServantData(
        servant: AtlasAcademyNiceServant,
        servantEngMap: Record<number, ServantEnData>,
        logger?: GameDataImportLogger
    ): GameServant | null {

        /*
         * Currently only normal servants (and Mash) are supported.
         */
        if (servant.type !== 'normal' && servant.type !== 'heroine') {
            return null;
        }

        logger?.info(servant.id, `Processing servant collectionNo=${servant.collectionNo}`);

        let ascensionMaterials: any;
        /*
         * Mash does not have any ascension materials to import.
         */
        if (servant.type !== 'heroine') {
            ascensionMaterials = {};
            for (let i = 0; i < Constants.AscensionLevelCount; i++) {
                const ascensionMaterial = servant.ascensionMaterials[i as AscensionMaterialKey];
                /*
                 * Atlas Academy ascension materials start at index 0 instead of 1. We need to
                 * add 1 to the index to have it line up with target data model.
                 */
                ascensionMaterials[i + 1] = this._transformEnhancementMaterials(ascensionMaterial);
            }
        }

        const skillMaterials = this._transformSkillMaterials(servant.skillMaterials);

        const appendSkillMaterials = this._transformSkillMaterials(servant.appendSkillMaterials);

        const costumes: Record<number, GameServantCostume> = {};
        if (servant.profile) {
            const costumeEntries = Object.entries(servant.profile.costume);
            for (const [id, costume] of costumeEntries) {
                const costumeId = Number(id); // Costume IDs should always be numbers.
                let materials: GameServantEnhancement;
                /*
                 * Some costumes do not require materials (ie. Mash's idol costume). For these
                 * costumes, the map will not contain an entry for the costume's ID.
                 */
                const costumeMaterials = servant.costumeMaterials[costumeId];
                if (!costumeMaterials) {
                    materials = { materials: [], qp: 0 };
                } else {
                    materials = this._transformEnhancementMaterials(costumeMaterials);
                }
                costumes[costumeId] = {
                    collectionNo: costume.costumeCollectionNo,
                    name: costume.name,
                    materials
                };
            }
        }

        const np = this._parseNoblePhantasms(servant.noblePhantasms);

        const result: GameServant = {
            _id: servant.id,
            name: servant.name,
            collectionNo: servant.collectionNo,
            class: AtlasAcademyDataImportService._ServantClassMap[servant.className],
            rarity: servant.rarity as GameServantRarity,
            cost: servant.cost,
            maxLevel: servant.lvMax,
            gender: AtlasAcademyDataImportService._ServantGenderMap[servant.gender],
            attribute: AtlasAcademyDataImportService._ServantAttributeMap[servant.attribute],
            hpBase: servant.hpBase,
            hpMax: servant.hpMax,
            atkBase: servant.atkBase,
            atkMax: servant.atkMax,
            growthCurve: this._convertGrowthCurve(servant.growthCurve),
            ascensionMaterials,
            skillMaterials,
            appendSkillMaterials,
            costumes,
            np,
            metadata: {
                displayName: servant.name,
                links: [] as Array<ExternalLink>
            }
        };

        this._populateServantEnglishStrings(result, servantEngMap, logger);

        logger?.info(servant.id, 'Servant processed');
        return result;
    }

    private _transformSkillMaterials(skillMaterials: Record<SkillMaterialKey, AtlasAcademyNiceLvlUpMaterial>): GameServantSkillMaterials {
        const result = {} as any;
        for (let i = 1; i <= Constants.SkillLevelCount; i++) {
            const skillMaterial = skillMaterials[i as SkillMaterialKey];
            result[i] = this._transformEnhancementMaterials(skillMaterial);
        }
        return result;
    }

    /**
     * Converts an Atlas Academy `AtlasAcademyNiceLvlUpMaterial` object into a
     * `GameServantEnhancement` object.
     */
    private _transformEnhancementMaterials(material: AtlasAcademyNiceLvlUpMaterial): GameServantEnhancement {
        const items = material.items.map(this._transformItemAmountData);
        return {
            materials: items,
            qp: material.qp
        };
    }

    /**
     * Converts a servant's in-game growth curve ID to a `GameServantGrowthCurve`
     * value.
     */
    private _convertGrowthCurve(growthCurve: number): GameServantGrowthCurve {
        if (growthCurve <= 5) {
            return GameServantGrowthCurve.Linear;
        } else if (growthCurve <= 10) {
            return GameServantGrowthCurve.ReverseS;
        } else if (growthCurve <= 15) {
            return GameServantGrowthCurve.S;
        } else if (growthCurve <= 25) {
            return GameServantGrowthCurve.SemiReverseS;
        }
        return GameServantGrowthCurve.SemiS;
    }


    /**
     * Converts an array of Atlas Academy `AtlasAcademyNiceTd` objects into an array
     * of `GameServantNoblePhantasm` objects.
     */
    private _parseNoblePhantasms(
        noblePhantasms: Array<AtlasAcademyNiceTd>,
        logger?: GameDataImportLogger
    ): Array<GameServantNoblePhantasm> {
        /*
         * Note that for the GameServantNoblePhantasm array, we only care about unique
         * combinations of card and target types. Examples:
         *
         * - Fairy Knight Lancelot has two noble phantasms: an arts type single target
         *   and a buster type AOE. She will have two entries in the resulting array.
         *
         * - Space Ishtar has switchable noble phantasm card types. She will have three
         *   entries in the resulting array.
         *
         * - Mash has two noble phantasm, but both are support art types. She will only
         *   have one entry in the resulting array.
         */
        const result = [] as Array<GameServantNoblePhantasm>;
        for (const { card, functions } of noblePhantasms) {
            const cardType = AtlasAcademyDataImportService._ServantCardTypeMap[card];
            if (!cardType) {
                logger?.error(`Unknown card type '${card}' encountered when parsing noble phantasm.`);
                continue;
            }
            let isDamageNp = false;
            let isAoe = false;
            for (const { funcType, funcTargetType } of functions) {
                if (this._isDamagingNp(funcType)) {
                    isDamageNp = true;
                    isAoe = funcTargetType === 'enemyAll';
                    break; // Assume that there is only one 'damageNp' function for each noble phantasm.
                }
            }
            const target = !isDamageNp ? GameServantNoblePhantasmTarget.Support
                : isAoe ? GameServantNoblePhantasmTarget.All : GameServantNoblePhantasmTarget.One;
            /*
             * Check if the combination already exists in the result.
             */
            let exists = false;
            for (const np of result) {
                if (np.cardType === cardType && np.target === target) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                result.push({ cardType, target });
            }
        }
        return result;
    }

    /**
     * Determines if the given function type indicates a damaging noble phantasm.
     */
    private _isDamagingNp(funcType: FunctionType): boolean {
        return funcType === 'damageNp' ||
            funcType === 'damageNpPierce' ||
            funcType === 'damageNpIndividual' ||
            funcType === 'damageNpStateIndividual' ||
            funcType === 'damageNpCounter' ||
            funcType === 'damageNpStateIndividualFix' ||
            funcType === 'damageNpSafe' ||
            funcType === 'damageNpRare' ||
            funcType === 'damageNpAndCheckIndividuality' ||
            funcType === 'damageNpIndividualSum';
    }

    /**
     * Populate the given servant with their English strings using the given lookup
     * map. If the name is not present in the map, the Japanese names will be retained.
     */
    private _populateServantEnglishStrings(
        servant: GameServant,
        servantEngMap: Record<number, ServantEnData>,
        logger?: GameDataImportLogger
    ): void {
        const servantEnData = servantEngMap[servant.collectionNo];
        if (!servantEnData) {
            logger?.warn(servant._id, 'English strings not available for servant. English string population will be skipped.');
            return;
        }
        /*
         * Populate English names
         */
        servant.name = servantEnData.name;
        servant.metadata.displayName = servantEnData.name;
        /*
         * Populate English costume names if available.
         */
        const costumeEnDataMap = servantEnData.profile?.costume;
        if (costumeEnDataMap) {
            const costumeEntries = Object.entries(servant.costumes);
            for (const [id, costume] of costumeEntries) {
                const costumeEnData = costumeEnDataMap[Number(id)];
                if (!costumeEnData) {
                    continue;
                }
                costume.name = costumeEnData.name;
            }
        }
    }

    //#endregion


    //#region Item import methods

    /**
     * Retrieves item data from the Atlas Academy API and converts it into a list
     * of `GameItem` objects.
     * 
     * @param skipIds The set of IDs to omit from the result.
     */
    async getItems(logger?: GameDataImportLogger): Promise<Array<GameItem>> {
        /*
         * Retrieve JP item data.
         */
        const jpItems = await this._getNiceItems('JP', logger);

        /*
         * Retrieve NA item data and convert it into name lookup map. This item data
         * will be used as the source for additional English strings (descriptions).
         * 
         * This is needed because as of 6/13/2021, the JP item data with English names
         * does not include English descriptions.
         */
        const naItems = await this._getNiceItems('NA', logger);
        const englishStrings: Record<number, AtlasAcademyNiceItem> = {};
        for (const item of naItems) {
            englishStrings[item.id] = item;
        }

        /*
         * Convert the JP item data into `GameItem` objects.
         */
        const items = jpItems
            .map(item => this._transformItemData(item, englishStrings, logger))
            .filter(item => item != null) as Array<GameItem>;

        return items;
    }

    /**
     * Retrieves the pre-generated nice item data from the Atlas Academy API.
     * Always retrieves the data with English names.
     */
    private async _getNiceItems(region: 'NA' | 'JP', logger?: GameDataImportLogger): Promise<Array<AtlasAcademyNiceItem>> {
        const filename = region === 'NA' ? Constants.NiceItemsFilename : Constants.NiceItemsEnglishFilename;
        const url = `${Constants.BaseUrl}/${Constants.ExportPath}/${region}/${filename}`;
        logger?.info(`Calling ${url}`);
        const response = await axios.get(url);
        // TODO Handle errors
        return response.data;
    }

    private _transformItemData(
        item: AtlasAcademyNiceItem,
        englishStrings: Record<number, AtlasAcademyNiceItem>,
        logger?: GameDataImportLogger
    ): GameItem | null {

        if (!this._shouldImportItem(item)) {
            return null;
        }

        logger?.info(item.id, 'Processing item');

        const background = AtlasAcademyDataImportService._ItemBackgroundMap[item.background];
        const uses = item.uses.map(use => AtlasAcademyDataImportService._ItemUsageMap[use]);
        const result: GameItem = {
            _id: item.id,
            name: item.name,
            description: item.detail,
            background,
            uses
        };
        this._populateItemEnglishStrings(result, englishStrings, logger);
        this._additionalTransforms(result);

        logger?.info(item.id, 'Item processed');
        return result;
    }

    /**
     * Only enhancement items and a select number of master items will be imported.
     */
    private _shouldImportItem(item: AtlasAcademyNiceItem): boolean {
        const { type, uses } = item;
        if (uses.length) {
            // Always import if the item has enhancement uses defined.
            return true;
        }
        return AtlasAcademyDataImportService._AdditionalItemImportTypes.has(type);
    }

    /**
     * Populate the given item with English strings using the given lookup map. If the
     * string data is not present in the map, the Japanese values will be retained.
     */
    private _populateItemEnglishStrings(
        item: GameItem,
        englishStrings: Record<number, AtlasAcademyNiceItem>,
        logger?: GameDataImportLogger
    ): void {

        const strings = englishStrings[item._id];
        if (!strings) {
            logger?.warn(
                `English strings not available for item with ID ${item._id}. 
                English string population will be skipped.`
            );
            return;
        }
        item.name = strings.name;
        item.description = strings.detail;
    }

    private _additionalTransforms(item: GameItem) {
        // Friend Point ID should be 12 to match its image ID.
        if (item._id === 4) {
            item._id = 12;
        }
        // Remove 'Quest Clear Reward' from QP name.
        if (item._id === 5) {
            item.name = 'Quantum Particles';
        }
    }

    //#endregion


    //#region Soundtrack import methods

    /**
     * Retrieves BGM data from the Atlas Academy API and converts it into a list of
     * `GameSoundtrack` objects.
     * 
     * @param skipIds The set of IDs to omit from the result.
     */
    async getSoundtracks(logger?: GameDataImportLogger): Promise<Array<GameSoundtrack>> {
        /*
         * Retrieve JP BGM data with English names.
         */
        const jpBgm = await this._getBgm(logger);

        /*
         * Convert the JP item data into `GameItem` objects.
         */
        const soundtracks = jpBgm
            .map(bgm => this._transformBgmData(bgm, logger))
            .filter(bgm => bgm != null) as Array<GameSoundtrack>;

        return soundtracks;
    }

    /**
     * Retrieves the pre-generated nice BGM data from the Atlas Academy API. Always
     * retrieves the JP data with English names.
     */
    private async _getBgm(logger?: GameDataImportLogger): Promise<Array<AtlasAcademyNiceBgmEntity>> {
        const url = `${Constants.BaseUrl}/${Constants.ExportPath}/JP/${Constants.NiceBgmEnglishFilename}`;
        logger?.info(`Calling ${url}`);
        const response = await axios.get(url);
        // TODO Handle errors
        return response.data;
    }

    private _transformBgmData(
        bgm: AtlasAcademyNiceBgmEntity,
        logger?: GameDataImportLogger
    ): GameSoundtrack | null {

        if (bgm.notReleased) {
            return null;
        }

        logger?.info(bgm.id, 'Processing soundtrack');

        let material = undefined;
        if (bgm.shop) {
            material = this._transformItemAmountData(bgm.shop.cost);
        }
        const result: GameSoundtrack = {
            _id: bgm.id,
            name: bgm.name,
            priority: bgm.priority,
            material,
            audioUrl: bgm.audioAsset,
            thumbnailUrl: bgm.logo
        };

        logger?.info(bgm.id, 'Soundtrack processed');
        return result;
    }

    //#endregion


    //#region Common methods

    private _transformItemAmountData({ item, amount }: AtlasAcademyNiceItemAmount): GameItemQuantity {
        return {
            itemId: item.id,
            quantity: amount
        };
    }

    //#endregion


}
