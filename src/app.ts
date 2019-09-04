
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const router = express.Router();

app.set('port', process.env.PORT || 3000);

const test = (req: Request, res: Response, next: NextFunction) => {
    res.send('TESTING 123');
};

app.get('/test', test);

export default app;
