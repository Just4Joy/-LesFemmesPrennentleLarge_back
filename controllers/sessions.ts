import { Request, Response, NextFunction } from 'express';
import express from 'express';
import Session from '../models/session';
import ISession from '../interfaces/ISession';
import { ErrorHandler } from '../helpers/errors';
import { number } from 'joi';

const sessionsController = express.Router();

sessionsController.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    (async () => {
      const limit: string = req.query.limit;
      try {
        const sessions: ISession[] = await Session.findSession(limit);
        return res.status(200).json(sessions);
      } catch (err) {
        next(err);
      }
    })();
  }
);

sessionsController.get(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => {
    (async () => {
      const { id } = req.params as ISession;
      try {
        const session: ISession = await Session.findOne(id);
        return res.status(200).json(session);
      } catch (err) {
        next(err);
      }
    })();
  }
);

sessionsController.post(
  '/',
  Session.validateSession,
  (req: Request, res: Response, next: NextFunction) => {
    (async () => {
      try {
        const session = req.body as ISession;
        const insertId: number = await Session.create(session);
        return res.status(200).json({ id_session: insertId, ...req.body });
      } catch (err) {
        next(err);
      }
    })();
  }
);

sessionsController.put(
  '/:idSession',
  Session.sessionExists,
  Session.validateSession,
  (req: Request, res: Response, next: NextFunction) => {
    const session = req.body as ISession;
    Session.update(parseInt(req.params.idSession, 10), session)
      .then((sessionUpdated) => {
        if (sessionUpdated) {
          res.status(200).send('User updated');
        } else {
          throw new ErrorHandler(500, `User cannot be updated`);
        }
      })
      .catch((err) => next(err));
  }
);

export default sessionsController;
