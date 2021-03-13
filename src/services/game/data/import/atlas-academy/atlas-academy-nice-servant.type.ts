import { AtlasAcademySvtClass } from './atlas-academy-svt-class.type';
import { AtlasAcademyNiceGender } from './atlas-academy-nice-gender.type';
import { AtlasAcademyAttribute } from './atlas-academy-attribute.enum';
import { AtlasAcademyNiceLvlUpMaterial } from './atlas-academy-nice-lvl-up-material.type';
import { AtlasAcademyNiceSvtType } from './atlas-academy-nice-svt-type.type';
import { AtlasAcademyNiceSvtFlag } from './atlas-academy-nice-svt-flag.type';

export type AscensionMaterialKey = 0 | 1 | 2 | 3;

export type SkillMaterialKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

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
    ascensionMaterials: Record<AscensionMaterialKey, AtlasAcademyNiceLvlUpMaterial>;
    skillMaterials: Record<SkillMaterialKey, AtlasAcademyNiceLvlUpMaterial>;
    costumeMaterials: Record<number, AtlasAcademyNiceLvlUpMaterial>;
};
