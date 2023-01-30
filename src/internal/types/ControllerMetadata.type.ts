import { UserAccessLevel } from '../enum/UserAccessLevel.enum';

export type ControllerMetadata = {

    prefix: string;

    defaultAccessLevel: UserAccessLevel;

};
