import { AtlasAcademyNiceStatusRank } from './atlas-academy-nice-status-rank.type';

/**
 * Atlas Academy `NiceLoreStats` enum values used by the `flag` property in the
 * `NiceServant` data schema.
 */
export type AtlasAcademyNiceLoreStats = {
    strength: AtlasAcademyNiceStatusRank;
    endurance: AtlasAcademyNiceStatusRank;
    agility: AtlasAcademyNiceStatusRank;
    luck: AtlasAcademyNiceStatusRank;
    np: AtlasAcademyNiceStatusRank;
};
