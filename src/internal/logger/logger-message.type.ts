import { LoggerMessageLevel } from '@fgo-planner/transform-external';

export type LoggerMessage = {

    level: LoggerMessageLevel;

    timestamp: Date;

    message: any;

};
