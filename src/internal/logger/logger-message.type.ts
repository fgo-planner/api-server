import { LoggerMessageLevel } from './logger-message-level.enum';

export type LoggerMessage = {

    level: LoggerMessageLevel;

    timestamp: Date;

    message: any;

};
