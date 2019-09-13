
import 'reflect-metadata';
import mongo from 'connect-mongo';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import loader from './loaders';

dotenv.config();

const MongoStore = mongo(session);

const app = express();

loader(app);

export default app;
