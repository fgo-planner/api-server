import { AtlasAcademyNiceCostume } from './atlas-academy-nice-costume.type';
import { AtlasAcademyNiceLoreStats } from './atlas-academy-nice-lore-stats.type';

export type AscensionMaterialKey = 0 | 1 | 2 | 3;

export type SkillMaterialKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Partial type definition for the `profile` path in the `NiceServant` data
 * schema.
 */
export type AtlasAcademyNiceServantProfile = {
    cv: string;
    illustrator: string;
    stats: AtlasAcademyNiceLoreStats;
    costume: Record<number, AtlasAcademyNiceCostume>;
};
