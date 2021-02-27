import { AtlasAcademySvtClass } from './atlas-academy-svt-class.type';
import { AtlasAcademyNiceGender } from './atlas-academy-nice-gender.type';
import { AtlasAcademyAttribute } from './atlas-academy-attribute.enum';
import { AtlasAcademyNiceLvlUpMaterial } from './atlas-academy-nice-lvl-up-material.type';
import { AtlasAcademyNiceSvtType } from './atlas-academy-nice-svt-type.type';
import { AtlasAcademyNiceSvtFlag } from './atlas-academy-nice-svt-flag.type';

/**
 * Partial type definition for Atlas Academy's `NiceServant` data schema.
 */
export type AtlasAcademyNiceServant = {
    id: number;
    collectionNo: number;
    name: string;
    className: AtlasAcademySvtClass;
    type: AtlasAcademyNiceSvtType;
    flag: AtlasAcademyNiceSvtFlag;
    rarity: number;
    cost: number;
    lvMax: number;
    gender: AtlasAcademyNiceGender;
    attribute: AtlasAcademyAttribute;
    atkBase: number;
    atkMax: number;
    hpBase: number;
    hpMax: number;
    growthCurve: number;
    ascensionMaterials: {
        0: AtlasAcademyNiceLvlUpMaterial;
        1: AtlasAcademyNiceLvlUpMaterial;
        2: AtlasAcademyNiceLvlUpMaterial;
        3: AtlasAcademyNiceLvlUpMaterial;
    };
    skillMaterials: {
        1: AtlasAcademyNiceLvlUpMaterial;
        2: AtlasAcademyNiceLvlUpMaterial;
        3: AtlasAcademyNiceLvlUpMaterial;
        4: AtlasAcademyNiceLvlUpMaterial;
        5: AtlasAcademyNiceLvlUpMaterial;
        6: AtlasAcademyNiceLvlUpMaterial;
        7: AtlasAcademyNiceLvlUpMaterial;
        8: AtlasAcademyNiceLvlUpMaterial;
        9: AtlasAcademyNiceLvlUpMaterial;
    };
};
