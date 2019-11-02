
export enum UserAccessLevel {

    /**
     * Indicates that all users can access the resource, even unauthenticated users.
     */
    Public = 0,

    /**
     * Indicates that only authenticated (logged-in) users can access the resource.
     */
    Authenticated = 1,

    /**
     * Indicates that only admin users acn access the resource.
     */
    Admin = 2
}