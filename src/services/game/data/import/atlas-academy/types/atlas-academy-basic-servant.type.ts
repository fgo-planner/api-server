import { AtlasAcademyNiceServantClassName } from './atlas-academy-nice-servant-class-name.enum';
import { AtlasAcademyNiceServantType } from './atlas-academy-nice-servant-type.enum';

/**
 * Partial type definition for Atlas Academy's `BasicServant` data schema.
 */
export type AtlasAcademyBasicServant = {
    id: number;
    collectionNo: number;
    name: string;
    type: AtlasAcademyNiceServantType;
    className: AtlasAcademyNiceServantClassName;
    rarity: number;
};
