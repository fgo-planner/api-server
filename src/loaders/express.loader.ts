import express, { Application } from 'express';

export default (app: Application) => {
    app.set('port', process.env.PORT || 3000);
    app.use(express.json());
};