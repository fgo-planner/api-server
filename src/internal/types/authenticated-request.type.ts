import { Request } from 'express';
import { AccessTokenPayload } from './token-payload.type';

export type AuthenticatedRequest = {
    token: AccessTokenPayload;
} & Request;
