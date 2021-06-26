import { AtlasAcademyNiceShop } from './atlas-academy-nice-shop.type';

/**
 * Partial type definition for Atlas Academy's `NiceBgmEntity` data schema.
 */
export type AtlasAcademyNiceBgmEntity = {

    id: number;

    name: string;

    fileName: string;

    audioAsset?: string;

    priority: number;

    detail: string;

    notReleased: boolean;

    shop?: AtlasAcademyNiceShop;

    logo: any;

};
