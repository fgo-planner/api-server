import mongoose from 'mongoose';

export default () => {
    mongoose.set('useFindAndModify', false);

    mongoose.connection.on('connected', () => console.log(`Mongoose connected to ${process.env.MONGODB_URI}`));
    mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected.'));
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
};
