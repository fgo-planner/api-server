import { UserAccessLevel } from '../enum/user-access-level.enum';

export type ControllerMetadata = {

    prefix: string;

    defaultAccessLevel: UserAccessLevel;

};
