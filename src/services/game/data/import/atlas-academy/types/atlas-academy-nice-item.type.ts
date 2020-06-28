import { AtlasAcademyNiceItemBackground } from './atlas-academy-nice-item-background.enum';
import { AtlasAcademyNiceItemType } from './atlas-academy-nice-item-type.enum';

/**
 * Partial type definition for Atlas Academy's `NiceItem` data schema.
 */
export type AtlasAcademyNiceItem = {
    id: number;
    name: string;
    type: AtlasAcademyNiceItemType;
    background: AtlasAcademyNiceItemBackground;
}
