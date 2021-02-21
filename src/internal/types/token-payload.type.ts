// Contains type definitions for JWT token payloads.

export type AccessTokenPayload = {
    id: string;
    admin?: boolean;
    iat?: number;
};
