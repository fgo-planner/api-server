// Contains type definitiions for JWT token payloads.

export type AccessTokenPayload = {
    id: string;
    admin?: boolean;
    iat?: number;
}
