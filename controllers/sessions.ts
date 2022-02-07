import { Request, Response, NextFunction, RequestHandler } from 'express';
import express from 'express';
import Session from '../models/session';
import User from '../models/user';
import ISession from '../interfaces/ISession';
import { ErrorHandler } from '../helpers/errors';
import IUser from '../interfaces/IUser';
import Weather from '../models/weather';
import { ResultSetHeader } from 'mysql2';

const sessionsController = express.Router();

sessionsController.get('/', (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const region = req.query.region as string;
  const limit = req.query.limit as string;
  const date = req.query.date as string;
  const pages = req.query.pages as string;
  const wahine = req.query.wahine as string;

  try {
    const sessions: ISession[] = await Session.findAll(
      Number(region),
      Number(limit),
      date,
      Number(pages),
      Number(wahine)
    );
    return res.status(200).json(sessions);
  } catch (err) {
    next(err);
  }
}) as RequestHandler);

sessionsController.get('/:idSession', (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idSession } = req.params as ISession;
  try {
    const session: ISession = await Session.findOne(idSession);
    return res.status(200).json(session);
  } catch (err) {
    next(err);
  }
}) as RequestHandler);

sessionsController.post('/', Session.validateSession, (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = req.body as ISession;

    const insertId: number = await Session.create(session);

    return res.status(200).json({ id_session: insertId, ...req.body });
  } catch (err) {
    next(err);
  }
}) as RequestHandler);

sessionsController.put(
  '/:idSession',
  Session.sessionExists,
  Session.validateSession,
  (req: Request, res: Response, next: NextFunction) => {
    const session = req.body as ISession;
    Session.update(parseInt(req.params.idSession, 10), session)
      .then((sessionUpdated) => {
        if (sessionUpdated) {
          res.status(200).send('Session updated');
        } else {
          throw new ErrorHandler(500, `Session cannot be updated`);
        }
      })
      .catch((err) => next(err));
  }
);

sessionsController.post('/:idSession/users/:idUser', ((
  req: Request,
  res: Response,
  next: NextFunction
) => {
  async () => {
    try {
      const { idSession } = req.params as ISession;
      const { idUser } = req.params as IUser;
      const userIsAlreadyInSession: boolean =
        await Session.checkIfUserHasSubscribe(idUser, idSession);
      if (!userIsAlreadyInSession) {
        const userSubscribed: boolean = await User.subscribe(idUser, idSession);
        if (userSubscribed) {
          const users = await User.findBySession(idSession);
          return res.status(200).json(users);
        }
        //Gérer le cas où ça ne marche pas
        else return res.status(422).json('NO SESSION FOUND');
      } else return res.status(422).json('USER ALREADY SUBSCRIBED');
    } catch (err) {
      next(err);
    }
  };
}) as RequestHandler);

sessionsController.delete(
  '/:idSession/users/:idUser',
  (req: Request, res: Response, next: NextFunction) => {
    (async () => {
      try {
        const { idSession } = req.params as ISession;
        const { idUser } = req.params as IUser;
        const result: any = await Session.checkIfUserHasSubscribe(
          idUser,
          idSession
        );
        if (result[0]) {
          const unsubscription: any = await User.unsubscribe(idUser, idSession);
          if (unsubscription.affectedRows === 1) {
            const users = await User.findBySession(idSession);
            return res.status(200).json(users);
          }
          return res.status(201).json('SUBSCRIPTION REMOVED');
        } else return res.status(404).json('RESSOURCE NOT FOUND');
      } catch (err) {
        next(err);
      }
    })();
  }
);

sessionsController.get(
  '/:idSession/users',
  (req: Request, res: Response, next: NextFunction) => {
    (async () => {
      try {
        const { idSession } = req.params as ISession;
        const session: ISession = await Session.findOne(idSession);
        if (session) {
          const users = await User.findBySession(idSession);
          return res.status(200).json(users);
        } else {
          return res.status(404).send('RESSOURCE NOT FOUND');
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

sessionsController.get('/:idSession/weather', (async (
  req: Request,
  res: Response
) => {
  const { idSession } = req.params;
  const sessionWeather = await Weather.findOneBySession(
    parseInt(idSession, 10)
  );
  res.status(200).json(sessionWeather);
}) as RequestHandler);

sessionsController.post('/:idSession/weather', (async (
  req: Request,
  res: Response
) => {
  const { idSession } = req.params;
  const { idWeather } = req.body;
  try {
    const created = await Weather.create(
      parseInt(idSession, 10),
      parseInt(idWeather, 10)
    );
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json(err);
  }
}) as RequestHandler);

sessionsController.delete('/:idSession/weather/:idWeather', (async (
  req: Request,
  res: Response
) => {
  const { idSession, idWeather } = req.params;
  try {
    //WTF! Changer nom de variable + tester
    const deletedWeatherFromSession = await Weather.destroy(
      parseInt(idSession, 10),
      parseInt(idWeather, 10)
    );
    res.status(204).json('RESSOURCE DELETED');
  } catch (err) {
    res.status(500).json(err);
  }
}) as RequestHandler);

sessionsController.delete('/:idSession', Session.sessionExists, (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idSession } = req.params as ISession;
    const deletedSession = await Session.destroy(parseInt(idSession, 10));

    return res.status(201).send('SESSION DELETED');
  } catch (err) {
    next(err);
  }
}) as RequestHandler);

export default sessionsController;
