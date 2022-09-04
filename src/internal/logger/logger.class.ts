import { LoggerMessage } from './logger-message.type';
import { BaseLogger, LoggerMessageLevel } from '@fgo-planner/transform-external';

export class Logger extends BaseLogger {

    private readonly _messages: Array<LoggerMessage> = [];

    constructor(name?: string) {
        super(name);
    }

    protected _append(_id: number | string | symbol | undefined, timestamp: Date, message: unknown, level: LoggerMessageLevel): void {
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
