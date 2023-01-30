import { Request } from 'express';
import { AccessTokenPayload } from './TokenPayload.type';

export type AuthenticatedRequest = {
    token: AccessTokenPayload;
} & Request;
