import { BaseLogger, LoggerMessageLevel } from '@fgo-planner/transform-external';
import { LoggerMessage } from './logger-message.type';

export class GameDataImportLogger extends BaseLogger<number> {

    private readonly _messages: Array<LoggerMessage> = [];

    private readonly _messageMapById: Record<number, Array<LoggerMessage>> = {};

    constructor(name?: string) {
        super(name);
    }

    protected _append(id: number | undefined, timestamp: Date, message: unknown, level: LoggerMessageLevel): void {
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