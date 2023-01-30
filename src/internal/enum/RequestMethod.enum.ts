const GET = 'get';
const POST = 'post';
const PUT = 'put';
const DELETE = 'delete';
// TODO Add 'patch' type.

export type RequestMethod =
    typeof GET |
    typeof POST |
    typeof PUT |
    typeof DELETE;

export const RequestMethod = {
    GET,
    POST,
    PUT,
    DELETE
} as const;
