import { GameItem, GameItemBackground, GameItemQuantity, GameItemUsage, GameServant, GameServantAttribute, GameServantClass, GameServantEnhancement, GameServantGender, GameServantGrowthCurve, GameServantRarity, GameServantSkillMaterials, GameSoundtrack } from '@fgo-planner/data';
import { GameServantCostume } from '@fgo-planner/data/lib/types/game/servant/game-servant-costume.type';
import axios from 'axios';
import { Logger } from 'internal';
import { Service } from 'typedi';
import { AtlasAcademyAttribute } from './atlas-academy-attribute.type';
import { AtlasAcademyBasicServant } from './atlas-academy-basic-servant.type';
import { AtlasAcademyDataImportConstants as Constants } from './atlas-academy-data-import.constants';
import { AtlasAcademyNiceBgmEntity } from './atlas-academy-nice-bgm-entity.type';
import { AtlasAcademyNiceGender } from './atlas-academy-nice-gender.type';
import { AtlasAcademyNiceItemAmount } from './atlas-academy-nice-item-amount.type';
import { AtlasAcademyNiceItemBGType } from './atlas-academy-nice-item-bg-type.type';
import { AtlasAcademyNiceItemType } from './atlas-academy-nice-item-type.type';
import { AtlasAcademyNiceItemUse } from './atlas-academy-nice-item-use.type';
import { AtlasAcademyNiceItem } from './atlas-academy-nice-item.type';
import { AtlasAcademyNiceLvlUpMaterial } from './atlas-academy-nice-lvl-up-material.type';
import { AscensionMaterialKey, AtlasAcademyNiceServant, SkillMaterialKey } from './atlas-academy-nice-servant.type';
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
        'unknown': GameServantClass.Unknown,
        'ALL': GameServantClass.Unknown // TODO Implement 'All' class
    } as { readonly [key in AtlasAcademySvtClass]: GameServantClass };

    /**
     * Maps the `AtlasAcademyNiceGender` values to the `GameServantGender` enum
     * values.
     */
    private static readonly _ServantGenderMap = {
        'male': GameServantGender.Male,
        'female': GameServantGender.Female,
        'unknown': GameServantGender.None
    } as { readonly [key in AtlasAcademyNiceGender]: GameServantGender };

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
    } as { readonly [key in AtlasAcademyAttribute]: GameServantAttribute };

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
    } as { readonly [key in AtlasAcademyNiceItemBGType]: GameItemBackground };

    /**
     * Maps the `AtlasAcademyNiceItemUse` values to the `GameItemUsage`
     * enum values.
     */
    private static readonly _ItemUsageMap = {
        'skill': GameItemUsage.Skill,
        'ascension': GameItemUsage.Ascension,
        'costume': GameItemUsage.Costume
    } as { readonly [key in AtlasAcademyNiceItemUse]: GameItemUsage };

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
    async getServants(skipIds: Set<number>, logger?: Logger): Promise<GameServant[]> {
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
        const niceServantsNa  = await this._getNiceServants('NA', logger);
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
                .filter(servant => servant != null && !skipIds.has(servant._id)) as GameServant[];
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
    private async _getNiceServants(region: 'NA' | 'JP', logger?: Logger): Promise<AtlasAcademyNiceServant[]> {
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
        logger?: Logger
    ): GameServant | null {

        // Currently only normal servants (and Mash) are supported.
        if (servant.type !== 'normal' && servant.type !== 'heroine') {
            return null;
        }

        let ascensionMaterials: any;
        // Mash does not have any ascension materials to import.
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
            metadata: {
                displayName: servant.name,
                links: [] as any[]
            }
        };

        this._populateServantEnglishStrings(result, servantEngMap, logger);

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
     * Populate the given servant with their English strings using the given lookup
     * map. If the name is not present in the map, the Japanese names will be retained.
     */
    private _populateServantEnglishStrings(servant: GameServant, servantEngMap: Record<number, ServantEnData>, logger?: Logger): void {

        const servantEnData = servantEngMap[servant.collectionNo];
        if (!servantEnData) {
            logger?.warn(
                `English strings not available for servant (collectionNo=${servant.collectionNo}).
                English string population will be skipped.`
            );
            return;
        }
        // Populate English names
        servant.name = servantEnData.name;
        servant.metadata.displayName = servantEnData.name;

        // Populate English costume names if available.
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
    async getItems(skipIds: Set<number>, logger?: Logger): Promise<GameItem[]> {
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
            .filter(item => item != null && !skipIds.has(item._id)) as GameItem[];

        return items;
    }

    /**
     * Retrieves the pre-generated nice item data from the Atlas Academy API.
     * Always retrieves the data with English names.
     */
    private async _getNiceItems(region: 'NA' | 'JP', logger?: Logger): Promise<AtlasAcademyNiceItem[]> {
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
        logger?: Logger
    ): GameItem | null {

        if (!this._shouldImportItem(item)) {
            return null;
        }
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
        logger?: Logger
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
    async getSoundtracks(skipIds: Set<number>, logger?: Logger): Promise<GameSoundtrack[]> {
        /*
         * Retrieve JP BGM data with English names.
         */
        const jpBgm = await this._getBgm(logger);

        /*
         * Convert the JP item data into `GameItem` objects.
         */
        const soundtracks = jpBgm
            .map(this._transformBgmData.bind(this))
            .filter(item => item != null && !skipIds.has(item._id)) as GameSoundtrack[];

        return soundtracks;
    }

    /**
     * Retrieves the pre-generated nice BGM data from the Atlas Academy API. Always
     * retrieves the JP data with English names.
     */
    private async _getBgm(logger?: Logger): Promise<AtlasAcademyNiceBgmEntity[]> {
        const url = `${Constants.BaseUrl}/${Constants.ExportPath}/JP/${Constants.NiceBgmEnglishFilename}`;
        logger?.info(`Calling ${url}`);
        const response = await axios.get(url);
        // TODO Handle errors
        return response.data;
    }

    private _transformBgmData(bgm: AtlasAcademyNiceBgmEntity): GameSoundtrack | null {
        if (bgm.notReleased) {
            return null;
        }
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
