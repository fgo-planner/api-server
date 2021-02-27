import { AtlasAcademyNiceItemBGType } from './atlas-academy-nice-item-bg-type.type';
import { AtlasAcademyNiceItemType } from './atlas-academy-nice-item-type.type';
import { AtlasAcademyNiceItemUse } from './atlas-academy-nice-item-use.type';

/**
 * Partial type definition for Atlas Academy's `NiceItem` data schema.
 */
export type AtlasAcademyNiceItem = {

    id: number;

    name: string;

    type: AtlasAcademyNiceItemType;

    uses: AtlasAcademyNiceItemUse[];

    detail: string;

    background: AtlasAcademyNiceItemBGType;

};
