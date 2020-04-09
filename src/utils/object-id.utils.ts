import { ObjectId } from 'bson';

export class ObjectIdUtils {

    static convertToObjectId(id: ObjectId | string) {
        if (typeof id !== 'string') {
            return id;
        }
        if (ObjectId.isValid(id)) {
            return new ObjectId(id);
        }
        return null;
    }

}
