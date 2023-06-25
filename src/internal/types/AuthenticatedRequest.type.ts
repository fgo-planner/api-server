import { Request } from 'express';
import { AccessTokenPayload } from './TokenPayload.type';

export type AuthenticatedRequest<T = any> = {
    token: AccessTokenPayload;
} & Request<any, any, T>;
