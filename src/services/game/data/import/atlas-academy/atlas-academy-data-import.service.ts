import { GameItem, GameServant, GameSoundtrack } from '@fgo-planner/data-mongo';
import { AtlasAcademyItemsTransformer, AtlasAcademyNiceBgmEntity, AtlasAcademyNiceItem, AtlasAcademyNiceServant, AtlasAcademyServantsTransformer, AtlasAcademySoundtracksTransformer } from '@fgo-planner/transform-external';
import axios from 'axios';
import { GameDataImportLogger } from 'internal';
import { Service } from 'typedi';
import { AtlasAcademyDataImportConstants as Constants } from './atlas-academy-data-import.constants';

@Service()
export class AtlasAcademyDataImportService {

    //#region Servant import methods

    /**
     * Retrieves servant data from the Atlas Academy API and converts it into a
     * list of `GameServant` objects.
     */
    async getServants(logger?: GameDataImportLogger): Promise<Array<GameServant>> {
        /**
         * Retrieve 'nice' JP servant data with lore and English names.
         */
        /** */
        const niceServants = await this._getNiceServants('JP', logger);
        
        /**
         * Also retrieve 'nice' NA servant data with lore. This is needed because as of
         * 9/3/2022, the JP servant data with English names does not include English
         * costume names, so additional English data set from NA is needed.
         */
        /** */
        const niceServantsNa = await this._getNiceServants('NA', logger);

        /**
         * Convert the servant data into `GameServant` objects.
         */
        try {
            return AtlasAcademyServantsTransformer.transform(niceServants, niceServantsNa, logger);
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

    //#endregion


    //#region Item import methods

    /**
     * Retrieves item data from the Atlas Academy API and converts it into a list
     * of `GameItem` objects.
     */
    async getItems(logger?: GameDataImportLogger): Promise<Array<GameItem>> {
        /**
         * Retrieve JP item data.
         */
        /** */
        const jpItems = await this._getNiceItems('JP', logger);

        /**
         * Also retrieve NA item data. This is needed because as of 9/3/2022, the JP
         * item data with English names does not include English descriptions.
         */
        /** */
        const naItems = await this._getNiceItems('NA', logger);
        const englishStrings: Record<number, AtlasAcademyNiceItem> = {};
        for (const item of naItems) {
            englishStrings[item.id] = item;
        }

        /**
         * Convert the JP item data into `GameItem` objects.
         */
        try {
            return AtlasAcademyItemsTransformer.transform(jpItems, naItems, logger);
        } catch (e) {
            console.error(e);
        }

        return [];
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

    //#endregion


    //#region Soundtrack import methods

    /**
     * Retrieves BGM data from the Atlas Academy API and converts it into a list of
     * `GameSoundtrack` objects.
     * 
     * @param skipIds The set of IDs to omit from the result.
     */
    async getSoundtracks(logger?: GameDataImportLogger): Promise<Array<GameSoundtrack>> {
        /**
         * Retrieve JP BGM data with English names.
         */
        /** */
        const jpBgm = await this._getBgm(logger);

        /**
         * Convert the JP item data into `GameSoundtrack` objects.
         */
        try {
            return AtlasAcademySoundtracksTransformer.transform(jpBgm, logger);
        } catch (e) {
            console.error(e);
        }

        return [];
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

    //#endregion

}
