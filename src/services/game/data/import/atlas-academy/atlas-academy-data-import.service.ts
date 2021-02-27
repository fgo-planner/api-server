import axios from 'axios';
import { GameItem, GameItemBackground, GameItemUsage, GameServant, GameServantAttribute, GameServantClass, GameServantEnhancement, GameServantGender, GameServantGrowthCurve, GameServantRarity } from 'data/types';
import { Logger } from 'internal';
import { Service } from 'typedi';
import { AtlasAcademyDataImportConstants as Constants } from './atlas-academy-data-import.constants';
import { AtlasAcademyAttribute } from './types/atlas-academy-attribute.enum';
import { AtlasAcademyBasicServant } from './types/atlas-academy-basic-servant.type';
import { AtlasAcademyNiceGender } from './types/atlas-academy-nice-gender.type';
import { AtlasAcademyNiceItemBGType } from './types/atlas-academy-nice-item-bg-type.type';
import { AtlasAcademyNiceItemType } from './types/atlas-academy-nice-item-type.type';
import { AtlasAcademyNiceItemUse } from './types/atlas-academy-nice-item-use.type';
import { AtlasAcademyNiceItem } from './types/atlas-academy-nice-item.type';
import { AtlasAcademyNiceLvlUpMaterial } from './types/atlas-academy-nice-lvl-up-material.type';
import { AtlasAcademyNiceServant } from './types/atlas-academy-nice-servant.type';
import { AtlasAcademySvtClass } from './types/atlas-academy-svt-class.type';

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
        'qp',           // QP
        'stone',        // Saint quartz
        'gachaTicket',  // Summon tickets
        'friendPoint',  // Friend points
        'anonymous',    // USOs
        'tdLvUp'        // Statues and grails
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
         * Retrieve 'nice' JP servant data.
         */
        const niceServants = await this._getNiceServants('JP', logger);

        console.log(niceServants.length);

        /*
         * Convert the JP servant data into `GameServant` objects.
         */
        const servants = niceServants
            .map(this._transformServantData.bind(this))
            .filter(servant => servant != null && !skipIds.has(servant._id)) as GameServant[];

        /*
         * Retrieve 'basic' JP servant data with English names and convert it into name
         * lookup map.
         */
        const basicServants = await this._getBasicServants(logger);
        const englishNames: Record<number, string> = {};
        for (const servant of basicServants) {
            englishNames[servant.collectionNo] = servant.name;
        }

        /*
         * Use the name lookup map to populate English names. This method will
         * automatically try to retrieve any names that are missing from the map.
         */
        await this._populateServantEnglishNames(servants, englishNames, logger);

        return servants;
    }

    /**
     * Retrieves the pre-generated nice servant data from the Atlas Academy API.
     */
    private async _getNiceServants(region: 'NA' | 'JP', logger?: Logger): Promise<AtlasAcademyNiceServant[]> {
        const url = `${Constants.BaseUrl}/${Constants.ExportPath}/${region}/${Constants.NiceServantsFilename}`;
        logger?.info(`Calling ${url}`);
        const response = await axios.get(url);
        // TODO Handle errors
        return response.data;
    }

    /**
     * Retrieves the pre-generated basic servant data from the Atlas Academy API.
     * This method will always retrieve the JP region data with English language
     * names.
     */
    private async _getBasicServants(logger?: Logger): Promise<AtlasAcademyBasicServant[]> {
        const url = `${Constants.BaseUrl}/${Constants.ExportPath}/JP/${Constants.BasicServantsFilename}`;
        logger?.info(`Calling ${url}`);
        const response = await axios.get(url);
        // TODO Handle errors
        return response.data;
    }

    /**
     * Converts a Atlas Academy `NiceServant` object into a `GameServant` object.
     */
    private _transformServantData(servant: AtlasAcademyNiceServant): GameServant | null {

        // Currently only normal servants (and Mash) are supported.
        if (servant.type !== 'normal' && servant.type !== 'heroine') {
            return null;
        }

        let ascensionMaterials: any;
        // Mash does not have any ascension materials to import.
        if (servant.type !== 'heroine') {
            ascensionMaterials = {};
            // As of 10/8/2020, ascension materials start at index 0 instead of 1.
            for (let i = 0; i < Constants.AscensionLevelCount; i++) {
                ascensionMaterials[i + 1] = this._transformEnhancementMaterials((servant.ascensionMaterials as any)[i]);
            }
        }

        const skillMaterials = {} as any;
        for (let i = 1; i <= Constants.SkillLevelCount; i++) {
            skillMaterials[i] = this._transformEnhancementMaterials((servant.skillMaterials as any)[i]);
        }

        return {
            _id: servant.id,
            name: servant.name,
            nameJp: servant.name,
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
            metadata: {
                displayName: servant.name,
                links: [] as any[]
            }
        };
    }

    /**
     * Converts an Atlas Academy `AtlasAcademyNiceLvlUpMaterial` object into a
     * `GameServantEnhancement` object.
     */
    private _transformEnhancementMaterials(material: AtlasAcademyNiceLvlUpMaterial): GameServantEnhancement {
        const items = material.items.map(item => {
            return {
                itemId: item.item.id,
                quantity: item.amount
            };
        });
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
     * Populate the servants in the given list with their English names using the
     * given lookup map. If the name is not present in the map, the Japanese names
     * will be retained.
     */
    private async _populateServantEnglishNames(
        servants: GameServant[], 
        englishNames: Record<number, string>, 
        logger?: Logger
    ): Promise<void> {

        for (const servant of servants) {
            const name = englishNames[servant.collectionNo];
            if (!name) {
                logger?.warn(
                    `English name not available for servant (collectionNo=${servant.collectionNo}).
                    English name population will be skipped.`
                );
                continue;
            }
            servant.name = name;
            servant.metadata.displayName = name;
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
         * Convert the JP item data into `GameServant` objects.
         */
        const items = jpItems
            .map(item => this._transformItemData(item))
            .filter(item => item != null && !skipIds.has(item._id)) as GameItem[];

        /**
         * Retrieve NA item data and convert it into name lookup map.
         */
        const naItems = await this._getNiceItems('NA', logger);
        const englishItems: Record<number, AtlasAcademyNiceItem> = {};
        for (const item of naItems) {
            englishItems[item.id] = item;
        }

        /*
         * Use the name lookup map to populate English names. This method will
         * automatically try to retrieve any names that are missing from the map.
         */
        await this._populateItemEnglishStrings(items, englishItems, logger);

        return items;
    }

    /**
     * Retrieves the pre-generated nice item data from the Atlas Academy API.
     */
    private async _getNiceItems(region: 'NA' | 'JP', logger?: Logger): Promise<AtlasAcademyNiceItem[]> {
        const url = `${Constants.BaseUrl}/${Constants.ExportPath}/${region}/${Constants.NiceItemsFilename}`;
        logger?.info(`Calling ${url}`);
        const response = await axios.get(url);
        // TODO Handle errors
        return response.data;
    }

    private _transformItemData(item: AtlasAcademyNiceItem): GameItem | null {
        if (!this._shouldImportItem(item)) {
            return null;
        }
        const background = AtlasAcademyDataImportService._ItemBackgroundMap[item.background];
        const uses = item.uses.map(use => AtlasAcademyDataImportService._ItemUsageMap[use]);
        return {
            _id: item.id,
            name: item.name,
            nameJp: item.name,
            description: item.detail,
            background,
            uses
        };
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
     * Populate the items in the given list with their English strings using the
     * given lookup map. If the string data is not present in the map, the Japanese
     * values will be retained.
     */
    private async _populateItemEnglishStrings(
        items: GameItem[],
        englishStrings: Record<number, AtlasAcademyNiceItem>,
        logger?: Logger
    ): Promise<void> {

        for (const item of items) {
            const strings = englishStrings[item._id];
            if (!strings) {
                logger?.warn(
                    `Item with ID ${item._id} could not be loaded. 
                    English name population will be skipped.`
                );
                continue;
            }
            item.name = strings.name;
            item.description = strings.detail;
        }
    }

    //#endregion

}
