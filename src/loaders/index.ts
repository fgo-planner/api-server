import { Application } from 'express';
import express from './express.loader';
import mongoose from './mongoose.loader';
import routes from './routes.loader';

export default (app: Application): void => {
    mongoose();
    express(app);
    routes(app);
};
