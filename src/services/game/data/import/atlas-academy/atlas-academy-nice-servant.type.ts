import { AtlasAcademyAttribute } from './atlas-academy-attribute.type';
import { AtlasAcademyBasicServant } from './atlas-academy-basic-servant.type';
import { AtlasAcademyNiceGender } from './atlas-academy-nice-gender.type';
import { AtlasAcademyNiceLvlUpMaterial } from './atlas-academy-nice-lvl-up-material.type';
import { AtlasAcademyNiceServantProfile } from './atlas-academy-nice-servant-profile.type';

export type AscensionMaterialKey = 0 | 1 | 2 | 3;

export type SkillMaterialKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Partial type definition for Atlas Academy's `NiceServant` data schema.
 */
export type AtlasAcademyNiceServant = AtlasAcademyBasicServant & {
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
    appendSkillMaterials: Record<SkillMaterialKey, AtlasAcademyNiceLvlUpMaterial>;
    costumeMaterials: Record<number, AtlasAcademyNiceLvlUpMaterial>;
    profile?: AtlasAcademyNiceServantProfile;
};
