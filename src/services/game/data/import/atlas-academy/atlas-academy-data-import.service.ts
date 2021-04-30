import { GameItem, GameItemBackground, GameItemUsage, GameServant, GameServantAttribute, GameServantClass, GameServantEnhancement, GameServantGender, GameServantGrowthCurve, GameServantRarity } from '@fgo-planner/data';
import { GameServantCostume } from '@fgo-planner/data/lib/types/game/servant/game-servant-costume.type';
import axios from 'axios';
import { Logger } from 'internal';
import { Service } from 'typedi';
import { AtlasAcademyAttribute } from './atlas-academy-attribute.type';
import { AtlasAcademyBasicServant } from './atlas-academy-basic-servant.type';
import { AtlasAcademyDataImportConstants as Constants } from './atlas-academy-data-import.constants';
import { AtlasAcademyNiceGender } from './atlas-academy-nice-gender.type';
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
         * Retrieve 'nice' JP servant data with lore.
         */
        const niceServants = await this._getNiceServants('JP', logger);

        /*
         * Retrieve 'nice' NA servant data with lore an convert it into a lookup map.
         * This map will be used to look up English strings.
         */
        const niceServantsNa  = await this._getNiceServants('NA', logger);
        const servantEnMap: Record<number, ServantEnData> = {};
        for (const servant of niceServantsNa) {
            servantEnMap[servant.collectionNo] = servant;
        }

        /*
         * Retrieve rest of servants' data with English names from 'basic' JP servant
         * data and add it to them to the lookup map.
         */
        const basicServants = await this._getBasicServants(logger);
        for (const servant of basicServants) {
            if (servantEnMap[servant.collectionNo]) {
                // Do not add if the servant is already in the map.
                continue;
            }
            servantEnMap[servant.collectionNo] = servant;
        }
        
        /*
         * Convert the servant data into `GameServant` objects.
         */
        try {

            const servants = niceServants
                .map(servant => this._transformServantData(servant, servantEnMap))
                .filter(servant => servant != null && !skipIds.has(servant._id)) as GameServant[];

                return servants;
        } catch (e) {
            console.error(e)
        }

        return [];
    }

    /**
     * Retrieves the pre-generated nice servant data with lore from the Atlas
     * Academy API.
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
    private _transformServantData(
        servant: AtlasAcademyNiceServant,
        servantEnMap: Record<number, ServantEnData>,
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

        const skillMaterials: any = {};
        for (let i = 1; i <= Constants.SkillLevelCount; i++) {
            const skillMaterial = servant.skillMaterials[i as SkillMaterialKey];
            skillMaterials[i] = this._transformEnhancementMaterials(skillMaterial);
        }

        const costumes: Record<number, GameServantCostume> = {};
        if (servant.profile) {
            const costumeEntries = Object.entries(servant.profile.costume);
            for (const costumeEntry of costumeEntries) {
                const id = Number(costumeEntry[0]); // Costume IDs should always be numbers.
                const costume = costumeEntry[1];
                let materials: GameServantEnhancement;
                /*
                 * Some costumes do not require materials (ie. Mash's idol costume). For these
                 * costumes, the map will not contain an entry for the costume's ID.
                 */
                const costumeMaterials = servant.costumeMaterials[id];
                if (!costumeMaterials) {
                    materials = { materials: [], qp: 0 };
                } else {
                    materials = this._transformEnhancementMaterials(costumeMaterials);
                }
                costumes[id] = {
                    collectionNo: costume.costumeCollectionNo,
                    name: costume.name,
                    nameJp: costume.name,
                    materials
                };
            }
        }

        const result: GameServant = {
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
            costumes,
            metadata: {
                displayName: servant.name,
                links: [] as any[]
            }
        };

        this._populateServantEnglishStrings(result, servantEnMap, logger);

        return result;
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
     * Populate the given servant with their English strings using the given lookup
     * map. If the name is not present in the map, the Japanese names will be retained.
     */
    private _populateServantEnglishStrings(servant: GameServant, servantEnMap: Record<number, ServantEnData>, logger?: Logger): void {

        const servantEnData = servantEnMap[servant.collectionNo];
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
            for (const costumeEntry of Object.entries(servant.costumes)) {
                const id = Number(costumeEntry[0]);
                const costumeEnData = costumeEnDataMap[id];
                if (!costumeEnData) {
                    continue;
                }
                const costume = costumeEntry[1];
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
         * Retrieve NA item data and convert it into name lookup map.
         */
        const naItems = await this._getNiceItems('NA', logger);
        const englishStrings: Record<number, AtlasAcademyNiceItem> = {};
        for (const item of naItems) {
            englishStrings[item.id] = item;
        }

        /*
         * Convert the JP item data into `GameServant` objects.
         */
        const items = jpItems
            .map(item => this._transformItemData(item, englishStrings))
            .filter(item => item != null && !skipIds.has(item._id)) as GameItem[];

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
            nameJp: item.name,
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
            item.nameJp = 'QP';
        }
    }

    //#endregion

}
