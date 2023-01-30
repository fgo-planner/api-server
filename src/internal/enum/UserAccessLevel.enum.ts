const Public = 0;
const Authenticated = 1;
const Admin = 2;

export type UserAccessLevel =
    typeof Public |
    typeof Authenticated |
    typeof Admin;

export const UserAccessLevel = {

    /**
     * Indicates that all users can access the resource, even unauthenticated users.
     */
    Public,

    /**
     * Indicates that only authenticated (logged-in) users can access the resource.
     */
    Authenticated,

    /**
     * Indicates that only admin users acn access the resource.
     */
    Admin
    
} as const;
