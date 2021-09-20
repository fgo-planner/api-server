import { mongooseConnection } from '@fgo-planner/data';

export default async (): Promise<void> => {
    const uri = process.env.MONGODB_URI ?? '';
    try {
        await mongooseConnection(uri);
    } catch (e) {
        console.error(e);
    }
};
