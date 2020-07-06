import axios from 'axios';
import { GameItem, GameItemBackground, GameItemType, GameServant, GameServantAttribute, GameServantClass, GameServantEnhancement, GameServantGender, GameServantGrowthCurve } from 'data/types';
import { Logger } from 'internal';
import { Service } from 'typedi';
import { AtlasAcademyDataImportConstants as Constants } from './atlas-academy-data-import.constants';
import { AtlasAcademyBasicServant } from './types/atlas-academy-basic-servant.type';
import { AtlasAcademyNiceItemBackground } from './types/atlas-academy-nice-item-background.enum';
import { AtlasAcademyNiceItemType } from './types/atlas-academy-nice-item-type.enum';
import { AtlasAcademyNiceItem } from './types/atlas-academy-nice-item.type';
import { AtlasAcademyNiceLvlUpMaterial } from './types/atlas-academy-nice-lvl-up-material.type';
import { AtlasAcademyNiceServantAttribute } from './types/atlas-academy-nice-servant-attribute.enum';
import { AtlasAcademyNiceServantClassName } from './types/atlas-academy-nice-servant-class-name.enum';
import { AtlasAcademyNiceServantGender } from './types/atlas-academy-nice-servant-gender.enum';
import { AtlasAcademyNiceServantType } from './types/atlas-academy-nice-servant-type.enum';
import { AtlasAcademyNiceServant } from './types/atlas-academy-nice-servant.type';

@Service()
export class AtlasAcademyDataImportService {

    //#region Enum maps

    /**
     * Maps `AtlasAcademyNiceServantClassName` enum values to `GameServantClass`
     * enum values.
     */
    private static readonly _ServantClassMap = {
        [AtlasAcademyNiceServantClassName.Saber]: GameServantClass.Saber,
        [AtlasAcademyNiceServantClassName.Archer]: GameServantClass.Archer,
        [AtlasAcademyNiceServantClassName.Lancer]: GameServantClass.Lancer,
        [AtlasAcademyNiceServantClassName.Rider]: GameServantClass.Rider,
        [AtlasAcademyNiceServantClassName.Caster]: GameServantClass.Caster,
        [AtlasAcademyNiceServantClassName.Assassin]: GameServantClass.Assassin,
        [AtlasAcademyNiceServantClassName.Berserker]: GameServantClass.Berserker,
        [AtlasAcademyNiceServantClassName.Shielder]: GameServantClass.Shielder,
        [AtlasAcademyNiceServantClassName.Ruler]: GameServantClass.Ruler,
        [AtlasAcademyNiceServantClassName.AlterEgo]: GameServantClass.AlterEgo,
        [AtlasAcademyNiceServantClassName.Avenger]: GameServantClass.Avenger,
        [AtlasAcademyNiceServantClassName.DemonGodPillar]: GameServantClass.Unknown,
        [AtlasAcademyNiceServantClassName.MoonCancer]: GameServantClass.MoonCancer,
        [AtlasAcademyNiceServantClassName.Foreigner]: GameServantClass.Foreigner,
        [AtlasAcademyNiceServantClassName.GrandCaster]: GameServantClass.Caster,
        [AtlasAcademyNiceServantClassName.BeastII]: GameServantClass.BeastII,
        [AtlasAcademyNiceServantClassName.BeastI]: GameServantClass.BeastI,
        [AtlasAcademyNiceServantClassName.BeastIIIR]: GameServantClass.BeastIIIR,
        [AtlasAcademyNiceServantClassName.BeastIIIL]: GameServantClass.BeastIIIL,
        [AtlasAcademyNiceServantClassName.BeastUnknown]: GameServantClass.Unknown,
        [AtlasAcademyNiceServantClassName.Unknown]: GameServantClass.Unknown,
        [AtlasAcademyNiceServantClassName.All]: GameServantClass.Unknown // TODO Implement 'All' class
    } as { [key in AtlasAcademyNiceServantClassName]: GameServantClass }

    /**
     * Maps `AtlasAcademyNiceServantGender` enum values to `GameServantGender` enum
     * values.
     */
    private static readonly _ServantGenderMap = {
        [AtlasAcademyNiceServantGender.Male]: GameServantGender.Male,
        [AtlasAcademyNiceServantGender.Female]: GameServantGender.Female,
        [AtlasAcademyNiceServantGender.Unknown]: GameServantGender.None
    } as { [key in AtlasAcademyNiceServantGender]: GameServantGender }

    /**
     * Maps `AtlasAcademyNiceServantAttribute` enum values to `GameServantAttribute`
     * enum values.
     */
    private static readonly _ServantAttributeMap = {
        [AtlasAcademyNiceServantAttribute.Human]: GameServantAttribute.Man,
        [AtlasAcademyNiceServantAttribute.Sky]: GameServantAttribute.Sky,
        [AtlasAcademyNiceServantAttribute.Earth]: GameServantAttribute.Earth,
        [AtlasAcademyNiceServantAttribute.Star]: GameServantAttribute.Star,
        [AtlasAcademyNiceServantAttribute.Beast]: GameServantAttribute.Beast
    } as { [key in AtlasAcademyNiceServantAttribute]: GameServantAttribute }

    /**
     * Maps `AtlasAcademyNiceItemBackground` enum values to `GameItemBackground`
     * enum values.
     */
    private static readonly _ItemBackgroundMap = {
        [AtlasAcademyNiceItemBackground.Zero]: GameItemBackground.None,
        [AtlasAcademyNiceItemBackground.Bronze]: GameItemBackground.Bronze,
        [AtlasAcademyNiceItemBackground.Silver]: GameItemBackground.Silver,
        [AtlasAcademyNiceItemBackground.Gold]: GameItemBackground.Gold,
        [AtlasAcademyNiceItemBackground.QuestClearQPReward]: GameItemBackground.QPReward
    } as { [key in AtlasAcademyNiceItemBackground]: GameItemBackground }

    /**
     * Maps `AtlasAcademyNiceItemType` enum values to `GameItemType` enum values.
     */
    private static readonly _ItemTypeMap = {
        [AtlasAcademyNiceItemType.QP]: GameItemType.Master,
        [AtlasAcademyNiceItemType.Stone]: GameItemType.Master,
        [AtlasAcademyNiceItemType.APRecover]: GameItemType.Master,
        [AtlasAcademyNiceItemType.APAdd]: GameItemType.Master,
        [AtlasAcademyNiceItemType.Mana]: GameItemType.Master,
        [AtlasAcademyNiceItemType.Key]: GameItemType.Master,
        [AtlasAcademyNiceItemType.GachaClass]: GameItemType.Master,
        [AtlasAcademyNiceItemType.GachaRelic]: GameItemType.Master,
        [AtlasAcademyNiceItemType.GachaTicket]: GameItemType.Master,
        [AtlasAcademyNiceItemType.Limit]: GameItemType.Master,
        [AtlasAcademyNiceItemType.SkillLvUp]: GameItemType.Enhancement,
        [AtlasAcademyNiceItemType.TdLvUp]: GameItemType.Enhancement,
        [AtlasAcademyNiceItemType.FriendPoint]: GameItemType.Master,
        [AtlasAcademyNiceItemType.EventPoint]: GameItemType.EventItem,
        [AtlasAcademyNiceItemType.EventItem]: GameItemType.EventItem,
        [AtlasAcademyNiceItemType.QuestRewardQp]: GameItemType.Master,
        [AtlasAcademyNiceItemType.ChargeStone]: GameItemType.Master,
        [AtlasAcademyNiceItemType.RPAdd]: GameItemType.EventItem,
        [AtlasAcademyNiceItemType.BoostItem]: GameItemType.EventItem,
        [AtlasAcademyNiceItemType.StoneFragments]: GameItemType.Master,
        [AtlasAcademyNiceItemType.Anonymous]: GameItemType.Master,
        [AtlasAcademyNiceItemType.RarePri]: GameItemType.Master,
        [AtlasAcademyNiceItemType.CostumeRelease]: GameItemType.Master,
        [AtlasAcademyNiceItemType.ItemSelect]: GameItemType.Master,
        [AtlasAcademyNiceItemType.CommandCardPrmUp]: GameItemType.Master,
        [AtlasAcademyNiceItemType.Dice]: GameItemType.EventItem
    } as { [key in AtlasAcademyNiceItemType]: GameItemType }

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
         * Retrieve JP servant data.
         */
        const jpServants = await this._getNiceServants('JP', logger);

        /*
         * Convert the JP servant data into `GameServant` objects.
         */
        const servants = jpServants
            .map(servant => this._transformServantData(servant))
            .filter(servant => servant != null && !skipIds.has(servant._id));

        /*
         * Retrieve basic servant data with English names and convert it into name
         * lookup map.
         */
        const naBasicServants = await this._getBasicServants(logger);
        const englishNames: { [key: number]: string } = {};
        for (const servant of naBasicServants) {
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
     * Retrieves the basic data for a single servant from the Atlas Academy API.
     * The English servant names are always retrieved using this method.
     * 
     * @deprecated No longer needed as a pre-generated JP servant list with English
     * is now available.
     */
    private async _getBasicServant(id: number, region: 'NA' | 'JP', logger?: Logger): Promise<AtlasAcademyBasicServant> {
        const url = `${Constants.BaseUrl}/${Constants.BasicPath}/${region}/${Constants.ServantPath}/${id}`;
        const params = { lang: 'en' };
        logger?.info(`Calling ${url} with params ${JSON.stringify(params)}`);
        try {
            const response = await axios.get(url, { params });
            return response.data;
        } catch (err) {
            logger?.error(err);
        }
        return null;
    }

    /**
     * Converts a Atlas Academy `NiceServant` object into a `GameServant` object.
     */
    private _transformServantData(servant: AtlasAcademyNiceServant): GameServant {

        // Currently only normal servants (and Mash) are supported.
        if (servant.type !== AtlasAcademyNiceServantType.Normal && servant.type !== AtlasAcademyNiceServantType.Heroine) {
            return null;
        }

        let ascensionMaterials: any;
        // Mash does not have any ascension materials to import.
        if (servant.type !== AtlasAcademyNiceServantType.Heroine) {
            ascensionMaterials = {};
            for (let i = 1; i <= Constants.AscensionLevelCount; i++) {
                ascensionMaterials[i] = this._transformEnhancementMaterials((servant.ascensionMaterials as any)[i]);
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
            rarity: servant.rarity,
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
                links: []
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
    private async _populateServantEnglishNames(servants: GameServant[], englishNames: { [key: number]: string }, logger?: Logger) {
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
            .filter(item => item != null && !skipIds.has(item._id));

        /**
         * Retrieve basic NA item data and convert it into name lookup map.
         */
        const naItems = await this._getNiceItems('NA', logger);
        const englishNames: { [key: number]: string } = {};
        for (const item of naItems) {
            englishNames[item.id] = item.name;
        }

        /*
         * Use the name lookup map to populate English names. This method will
         * automatically try to retrieve any names that are missing from the map.
         */
        await this._populateItemEnglishNames(items, englishNames, logger);

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

    /**
     * Retrieves the data for a single item from the Atlas Academy API. The English
     * item names are always retrieved using this method.
     */
    private async _getNiceItem(id: number, region: 'NA' | 'JP', logger?: Logger): Promise<AtlasAcademyNiceItem> {
        const url = `${Constants.BaseUrl}/${Constants.NicePath}/${region}/${Constants.ItemPath}/${id}`;
        const params = { lang: 'en' };
        logger?.info(`Calling ${url} with params ${JSON.stringify(params)}`);
        try {
            const response = await axios.get(url, { params });
            return response.data;
        } catch (err) {
            logger?.error(err);
        }
        return null;
    }

    private _transformItemData(item: AtlasAcademyNiceItem): GameItem {
        /*
         * As of 6/28/2020, some item types in the Atlas Academy data set have not been
         * given a name (`25` and `26`). These items will be skipped for now.
         */
        if (typeof item.type === 'number') {
            return null;
        }
        return {
            _id: item.id,
            name: item.name,
            nameJp: item.name,
            background: AtlasAcademyDataImportService._ItemBackgroundMap[item.background],
            type: AtlasAcademyDataImportService._ItemTypeMap[item.type]
        };
    }

    /**
     * Populate the items in the given list with their English names using the
     * given lookup map. If the name is not present in the map, then the method
     * will attempt to retrieve the name from the Atlas Academy API.
     */
    private async _populateItemEnglishNames(items: GameItem[], englishNames: { [key: number]: string }, logger?: Logger) {
        for (const item of items) {
            let name = englishNames[item._id];
            if (!name) {
                const niceItem = await this._getNiceItem(item._id, 'JP', logger);
                if (!niceItem) {
                    logger?.warn(
                        `Item with ID ${item._id} could not be loaded. 
                        English name population will be skipped.`
                    );
                    continue;
                }
                name = niceItem.name;
            }
            item.name = name;
        }
    }

    //#endregion

}
