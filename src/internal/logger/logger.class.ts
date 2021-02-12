import { LoggerMessageLevel } from './logger-message-level.enum';
import { LoggerMessage } from './logger-message.type';

export class Logger {

    private readonly _messages: LoggerMessage[] = [];

    private _start?: Date;
    get start() {
        return this._start;
    }

    private _end?: Date;
    get end() {
        return this._end;
    }

    get name() {
        return this._name;
    }

    constructor(private _name?: string) {

    }

    setStart(date?: Date) {
        if (!date) {
            date = new Date();
        }
        return this._start = date;
    }

    setEnd(date?: Date) {
        if (!date) {
            date = new Date();
        }
        return this._end = date;
    }

    info(message: any): void {
        console.log(message);
        this._log(LoggerMessageLevel.Info, message);
    }

    warn(message: any): void {
        console.warn(message);
        this._log(LoggerMessageLevel.Warn, message);
    }

    error(message: any): void {
        console.error(message);
        this._log(LoggerMessageLevel.Error, message);
    }

    private _log(level: LoggerMessageLevel, message: any) {
        const timestamp = new Date();
        this._messages.push({ level, timestamp, message });
    }

    toJSON() {
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
        object.messages = this._messages;
        return object;
    }

}