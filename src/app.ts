
import 'reflect-metadata';
import moduleAlias from './moduleAlias';

// Resolve module paths before importing anything else.
moduleAlias(require('../tsconfig.json'), __dirname); // eslint-disable-line

import dotenv from 'dotenv';
import express from 'express';
import loader from './loaders';

dotenv.config();

const app = express();

loader(app);

export default app;
