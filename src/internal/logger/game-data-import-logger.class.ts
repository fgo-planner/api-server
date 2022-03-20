import { LoggerMessageLevel } from './logger-message-level.enum';
import { LoggerMessage } from './logger-message.type';
import { Logger } from './logger.class';

export class GameDataImportLogger extends Logger {

    private readonly _messageMapById: Record<number, Array<LoggerMessage>> = {};

    constructor(name?: string) {
        super(name);
    }

    info(message: string | unknown): void;
    info(id: number, message: string | unknown): void;
    info(param1: number | string | unknown, param2?: string | unknown): void {
        this._log(param1, param2);
    }

    warn(message: string | unknown): void;
    warn(id: number, message: string | unknown): void;
    warn(param1: number | string | unknown, param2?: string | unknown): void {
        this._log(param1, param2, LoggerMessageLevel.Warn);
    }
    
    error(message: string | unknown): void;
    error(id: number, message: string | unknown): void;
    error(param1: number | string | unknown, param2?: string | unknown): void {
        this._log(param1, param2, LoggerMessageLevel.Error);
    }

    protected _log(param1: number | string | unknown, param2?: string | unknown, level = LoggerMessageLevel.Info): void {
        let id, message;
        if (param2 !== undefined) {
            id = param1 as number;
            message = param2;
        } else {
            id = undefined;
            message = param1;
        }
        this._printToConsole(id, message, level);
        const timestamp = new Date();
        if (id === undefined) {
            this._messages.push({ level, timestamp, message });
        } else {
            let bucket = this._messageMapById[id];
            if (!bucket) {
                this._messageMapById[id] = bucket = [];
            }
            bucket.push({ level, timestamp, message });
        }
    }

    private _printToConsole(id: number | undefined, message: string | unknown, level = LoggerMessageLevel.Info): void {
        if (level === LoggerMessageLevel.Info) {
            id === undefined ? console.log(message) : console.log(id, message);
        } else if (level === LoggerMessageLevel.Warn) {
            id === undefined ? console.warn(message) : console.warn(id, message);
        } else if (level === LoggerMessageLevel.Error) {
            id === undefined ? console.error(message) : console.error(id, message);
        }
    }

    toJSON(): string {
        const object: any = {};
        if (this._name != null) {
            object.name = this._name;
        }
        if (this._start != null) {
            object.start = this._start;
        }
        if (this._end != null) {
            object.end = this._end;
        }
        object.messages = {
            global: this._messages,
            ...this._messageMapById
        };
        return object;
    }

}