import { AtlasAcademyNiceSvtFlag } from './atlas-academy-nice-svt-flag.type';
import { AtlasAcademyNiceSvtType } from './atlas-academy-nice-svt-type.type';
import { AtlasAcademySvtClass } from './atlas-academy-svt-class.type';

/**
 * Partial type definition for Atlas Academy's `BasicServant` data schema.
 */
export type AtlasAcademyBasicServant = {
    id: number;
    collectionNo: number;
    name: string;
    type: AtlasAcademyNiceSvtType;
    flag: AtlasAcademyNiceSvtFlag;
    className: AtlasAcademySvtClass;
    rarity: number;
};
