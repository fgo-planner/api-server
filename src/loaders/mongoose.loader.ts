import mongoose, { ConnectOptions } from 'mongoose';

const onConnected = () => {
    console.log(`Mongoose connected to ${process.env.MONGODB_URI}`);
};

const onDisconnected = () => {
    console.log('Mongoose disconnected');
};

export default () => {
    mongoose.set('useFindAndModify', false);
    
    mongoose.connection.on('connected', onConnected);
    mongoose.connection.on('disconnected', onDisconnected);
    
    const uris = process.env.MONGODB_URI ?? '';
    const options: ConnectOptions = {
        useNewUrlParser: true
    };

    mongoose.connect(uris, options);
};
