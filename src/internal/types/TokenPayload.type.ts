// Contains type definitions for JWT token payloads.

import { JwtPayload } from 'jsonwebtoken';

/**
 * Access token payload.
 */
export type AccessTokenPayload = JwtPayload & {
    /**
     * The user's ID.
     */
    id: string;
    /**
     * Whether the user has admin privilege.
     */
    admin?: boolean;
};

/**
 * Refresh token payload.
 */
export type RefreshTokenPayload = JwtPayload & {
    // TODO Implement this
};
