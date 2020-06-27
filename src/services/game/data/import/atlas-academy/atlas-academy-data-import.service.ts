import axios from 'axios';
import { GameServant, GameServantAttribute, GameServantClass, GameServantEnhancement, GameServantGender } from 'data/types';
import { Service } from 'typedi';
import { AtlasAcademyDataImportConstants as Constants } from './atlas-academy-data-import.constants';
import { AtlasAcademyBasicServant } from './types/atlas-academy-basic-servant.type';
import { AtlasAcademyNiceLvlUpMaterial } from './types/atlas-academy-nice-lvl-up-material.type';
import { AtlasAcademyNiceServantAttribute } from './types/atlas-academy-nice-servant-attribute.enum';
import { AtlasAcademyNiceServantClassName } from './types/atlas-academy-nice-servant-class-name.enum';
import { AtlasAcademyNiceServantGender } from './types/atlas-academy-nice-servant-gender.enum';
import { AtlasAcademyNiceServantType } from './types/atlas-academy-nice-servant-type.enum';
import { AtlasAcademyNiceServant } from './types/atlas-academy-nice-servant.type';

@Service()
export class AtlasAcademyDataImportService {

    /**
     * Maps `AtlasAcademyNiceServantClassName` enum values to `GameServantClass`
     * enum values.
     */
    private static readonly _ClassMap = {
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
    private static readonly _GenderMap = {
        [AtlasAcademyNiceServantGender.Male]: GameServantGender.Male,
        [AtlasAcademyNiceServantGender.Female]: GameServantGender.Female,
        [AtlasAcademyNiceServantGender.Unknown]: GameServantGender.None
    } as { [key in AtlasAcademyNiceServantGender]: GameServantGender }

    /**
     * Maps `AtlasAcademyNiceServantAttribute` enum values to `GameServantAttribute`
     * enum values.
     */
    private static readonly _AttributeMap = {
        [AtlasAcademyNiceServantAttribute.Human]: GameServantAttribute.Man,
        [AtlasAcademyNiceServantAttribute.Sky]: GameServantAttribute.Sky,
        [AtlasAcademyNiceServantAttribute.Earth]: GameServantAttribute.Earth,
        [AtlasAcademyNiceServantAttribute.Star]: GameServantAttribute.Star,
        [AtlasAcademyNiceServantAttribute.Beast]: GameServantAttribute.Beast
    } as { [key in AtlasAcademyNiceServantAttribute]: GameServantAttribute }

    /**
     * Retrieves servant data from the Atlas Academy API and converts it into a
     * list of `GameServant` objects.
     */
    async getServants(): Promise<GameServant[]> {
        /*
         * Retrieve JP servant data.
         */
        const jpServants = await this._getServants('JP');

        /*
         * Convert the JP servant data into `GameServant` objects.
         */
        const servants = jpServants
            .map(servant => this._transformJpServantData(servant))
            .filter(servant => servant != null);

        /**
         * Retrieve basic NA servant data and convert it into name lookup map.
         */
        const naBasicServants = await this._getBasicServants('NA');
        const englishNames: { [key: number]: string } = {};
        for (const servant of naBasicServants) {
            englishNames[servant.collectionNo] = servant.name;
        }

        /*
         * Use the name lookup map to populate English names. This method will
         * automatically try to retrieve any names that are missing from the map.
         */
        await this._populateEnglishNames(servants, englishNames);

        return servants;
    }


    /**
     * Retrieves the pre-generated nice servant data from the Atlas Academy API.
     */
    private async _getServants(region: 'NA' | 'JP'): Promise<AtlasAcademyNiceServant[]> {
        const url = `${Constants.BaseUrl}/${Constants.ExportPath}/${region}/${Constants.NiceServantsFilename}`;
        console.log(`Calling ${url}`)
        const response = await axios.get(url);
        // TODO Handle errors
        return response.data;
    }

    /**
     * Retrieves the pre-generated basic servant data from the Atlas Academy API.
     */
    private async _getBasicServants(region: 'NA' | 'JP'): Promise<AtlasAcademyBasicServant[]> {
        const url = `${Constants.BaseUrl}/${Constants.ExportPath}/${region}/${Constants.BasicServantsFilename}`;
        console.log(`Calling ${url}`)
        const response = await axios.get(url);
        // TODO Handle errors
        return response.data;
    }

    /**
     * Retrieves the basic data for a single servant from the Atlas Academy API.
     * The English servant names are always retrieved using this method.
     */
    private async _getBasicServant(id: number, region: 'NA' | 'JP'): Promise<AtlasAcademyBasicServant> {
        const url = `${Constants.BaseUrl}/${Constants.BasicPath}/${region}/${Constants.ServantPath}/${id}`;
        const params = { lang: 'en' };
        console.log(`Calling ${url} with params ${JSON.stringify(params)}`)
        const response = await axios.get(url, { params });
        // TODO Handle errors
        return response.data;
    }

    /**
     * Converts a Atlas Academy `NiceServant` object into a `GameServant` object.
     */
    private _transformJpServantData(servant: AtlasAcademyNiceServant): GameServant {

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
            class: AtlasAcademyDataImportService._ClassMap[servant.className],
            rarity: servant.rarity,
            cost: servant.cost,
            maxLevel: servant.lvMax,
            gender: AtlasAcademyDataImportService._GenderMap[servant.gender],
            attribute: AtlasAcademyDataImportService._AttributeMap[servant.attribute],
            hpBase: servant.hpBase,
            hpMax: servant.hpMax,
            atkBase: servant.atkBase,
            atkMax: servant.atkMax,
            growthCurve: servant.growthCurve,
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
            }
        });
        return {
            materials: items,
            qp: material.qp
        };
    }

    /**
     * Populate the servants int he given list with their English names using the
     * given lookup map. If the name is not present in the map, then the method
     * will attempt to retrieve the name from the Atlas Academy API.
     */
    private async _populateEnglishNames(servants: GameServant[], englishNames: { [key: number]: string }) {
        for (const servant of servants) {
            let name = englishNames[servant.collectionNo];
            if (!name) {
                const basicServant = await this._getBasicServant(servant.collectionNo, 'JP');
                if (!basicServant) {
                    continue;
                }
                name = basicServant.name;
            }
            servant.name = name;
            servant.metadata.displayName = name;
        }
    }

}
