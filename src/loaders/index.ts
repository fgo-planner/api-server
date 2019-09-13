import { Application } from 'express';
import mongoose from './mongoose.loader';
import express from './express.loader';
import routes from './routes.loader';
import passport from './passport.loader';

export default (app: Application) => {
    mongoose();
    express(app);
    passport();
    routes(app);
};