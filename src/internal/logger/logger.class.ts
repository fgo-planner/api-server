import { LoggerMessageLevel } from './logger-message-level.enum';
import { LoggerMessage } from './logger-message.type';

export class Logger {

    protected readonly _messages: LoggerMessage[] = [];

    protected _start?: Date;
    get start(): Date | undefined {
        return this._start;
    }

    protected _end?: Date;
    get end(): Date | undefined {
        return this._end;
    }

    get name(): string | undefined {
        return this._name;
    }

    constructor(protected _name?: string) {

    }

    setStart(date?: Date): Date | undefined {
        if (!date) {
            date = new Date();
        }
        return this._start = date;
    }

    setEnd(date?: Date): Date | undefined {
        if (!date) {
            date = new Date();
        }
        return this._end = date;
    }

    info(message: string | unknown): void {
        console.log(message);
        this._log(LoggerMessageLevel.Info, message);
    }

    warn(message: string | unknown): void {
        console.warn(message);
        this._log(LoggerMessageLevel.Warn, message);
    }

    error(message: string | unknown): void {
        console.error(message);
        this._log(LoggerMessageLevel.Error, message);
    }

    protected _log(level: LoggerMessageLevel, message: any) {
        const timestamp = new Date();
        this._messages.push({ level, timestamp, message });
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
        object.messages = this._messages;
        return object.toJSON();
    }

}