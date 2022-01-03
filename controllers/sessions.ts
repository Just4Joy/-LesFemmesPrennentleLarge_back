import { Request, Response, NextFunction } from 'express';
import express from 'express';
import Session from '../models/session';
import ISession from '../interfaces/ISession';
import { ErrorHandler } from '../helpers/errors';

const sessionsController = express.Router();

sessionsController.get(
  '/',
  (_req: Request, res: Response, next: NextFunction) => {
    async () => {
      try {
        const sessions: ISession[] = await Session.findSession();
        return res.status(200).json(sessions);
      } catch (err) {
        next(err);
      }
    };
  }
);

sessionsController.post(
  '/',
  Session.validateSession,
  (req: Request, res: Response, next: NextFunction) => async () => {
    try {
      const session = req.body as ISession;
      const insertId: number = await Session.create(session);
      return res.status(200).json({ id_session: insertId, ...req.body });
    } catch (err) {
      next(err);
    }
  }
);

sessionsController.put(
  '/:idSession',
  Session.sessionExists,
  Session.validateSession,
  (req: Request, res: Response, next: NextFunction) => {
    const session = req.body as ISession;
    Session.update(Number(req.params.id_session), session)
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
