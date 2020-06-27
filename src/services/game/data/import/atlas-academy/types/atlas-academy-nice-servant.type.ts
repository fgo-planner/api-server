import { AtlasAcademyNiceServantClassName } from './atlas-academy-nice-servant-class-name.enum';
import { AtlasAcademyNiceServantType } from './atlas-academy-nice-servant-type.enum';
import { AtlasAcademyNiceServantGender } from './atlas-academy-nice-servant-gender.enum';
import { AtlasAcademyNiceServantAttribute } from './atlas-academy-nice-servant-attribute.enum';
import { AtlasAcademyNiceLvlUpMaterial } from './atlas-academy-nice-lvl-up-material.type';

/**
 * Partial type definition for Atlas Academy's `NiceServant` data schema.
 */
export type AtlasAcademyNiceServant = {
    id: number;
    collectionNo: number;
    name: string;
    className: AtlasAcademyNiceServantClassName;
    type: AtlasAcademyNiceServantType;
    rarity: number;
    cost: number;
    lvMax: number;
    gender: AtlasAcademyNiceServantGender;
    attribute: AtlasAcademyNiceServantAttribute;
    atkBase: number;
    atkMax: number;
    hpBase: number;
    hpMax: number;
    growthCurve: number;
    ascensionMaterials: {
        1: AtlasAcademyNiceLvlUpMaterial;
        2: AtlasAcademyNiceLvlUpMaterial;
        3: AtlasAcademyNiceLvlUpMaterial;
        4: AtlasAcademyNiceLvlUpMaterial;
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
