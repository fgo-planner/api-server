import { AtlasAcademyNiceCardType } from './atlas-academy-nice-card-type.type';
import { AtlasAcademyNiceFunction } from './atlas-academy-nice-function.type';

/**
 * Partial type definition for Atlas Academy's `NiceTd` data schema.
 */
export type AtlasAcademyNiceTd = {
    id: number;
    num: number;
    card: AtlasAcademyNiceCardType;
    name: string;
    ruby: string;
    icon?: string;
    rank: string;
    type: string;
    detail?: string;
    unmodifiedDetail?: string;
    npGain: any; // TODO Add type for this (NpGain)
    npDistribution: any; // TODO Add type for this (Npdistribution)
    strengthStatus: number;
    priority: number;
    individuality: Array<any>; // TODO Add type for this (NiceTrait)
    functions: Array<AtlasAcademyNiceFunction>;
};
