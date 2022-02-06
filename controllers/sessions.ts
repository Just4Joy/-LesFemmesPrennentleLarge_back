import { Request, Response, NextFunction, RequestHandler } from 'express';
import express from 'express';
import Session from '../models/session';
import User from '../models/user';
import ISession from '../interfaces/ISession';
import { ErrorHandler } from '../helpers/errors';
import IUser from '../interfaces/IUser';
import Weather from '../models/weather';
import { formatSortString } from '../helpers/functions';
import * as Auth from '../helpers/auth';
import IWeather from '../interfaces/IWeather';

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
  const sortBy: string = req.query.sort as string;

  try {
    const sessions: ISession[] = await Session.findSession(
      Number(region),
      Number(limit),
      date,
      Number(pages),
      Number(wahine),
      formatSortString(sortBy)
    );
    res.setHeader(
      'Content-Range',
      `users : 0-${sessions.length}/${sessions.length + 1}`
    );
    return res.status(200).json(sessions);
  } catch (err) {
    next(err);
  }
}) as RequestHandler);

sessionsController.get('/:id_session', (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id_session } = req.params as ISession;
  const { display } = req.query as ISession;
  try {
    const session: ISession = await Session.findOne(id_session, display);

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
  '/:id_session',
  Auth.getCurrentSession,
  Auth.checkSessionPrivileges,
  Session.validateSession,
  Session.sessionExists,
  (req: Request, res: Response, next: NextFunction) => {
    const session = req.body as ISession;
    const { id_session } = req.params as ISession;
    Session.update(id_session, session)
      .then((sessionUpdated) => {
        if (sessionUpdated) {
          res.status(200).json({ id: id_session, ...req.body }); // react-admin needs this response
        } else {
          throw new ErrorHandler(500, `Session cannot be updated`);
        }
      })
      .catch((err) => next(err));
  }
);

sessionsController.post('/:id_session/users/:id_user', (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id_session } = req.params as ISession;
    const { id_user } = req.params as IUser;
    const result = await Session.checkIfUserHasSubscribe(id_user, id_session);
    // @ts-ignore: Unreachable code error
    if (!result[0]) {
      const subscription = await User.subscribe(id_user, id_session);
      if (subscription.affectedRows === 1) {
        const users = await User.allUserBySession(id_session);
        return res.status(200).json(users);
      }
      return res.status(201).json('SUBSCRIPTION ADDED');
    } else return res.status(422).json('USER ALREADY SUBSCRIBE');
  } catch (err) {
    next(err);
  }
}) as RequestHandler);

sessionsController.delete('/:id_session/users/:id_user', (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id_session } = req.params as ISession;
    const { id_user } = req.params as IUser;
    const result = await Session.checkIfUserHasSubscribe(id_user, id_session);
    // @ts-ignore: Unreachable code error
    if (result[0]) {
      const unsubscription = await User.unsubscribe(id_user, id_session);
      if (unsubscription.affectedRows === 1) {
        const users = await User.allUserBySession(id_session);
        return res.status(200).json(users);
      }
      return res.status(201).json('SUBSCRIPTION REMOVED');
    } else return res.status(404).json('RESSOURCE NOT FOUND');
  } catch (err) {
    next(err);
  }
}) as RequestHandler);

sessionsController.get('/:id_session/users', (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { display } = req.query as ISession;
  const { id_session } = req.params as ISession;
  try {
    const session: ISession = await Session.findOne(id_session, display);
    if (session) {
      const users = await User.allUserBySession(id_session);
      return res.status(200).json(users);
    } else {
      return res.status(404).send('RESSOURCE NOT FOUND');
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler);

sessionsController.get('/:id_session/weather', (async (
  req: Request,
  res: Response
) => {
  const { id_session } = req.params;
  const sessionWeather = await Weather.getWeatherBySession(
    parseInt(id_session, 10)
  );
  res.status(200).json(sessionWeather);
}) as RequestHandler);

sessionsController.post('/:id_session/weather', (async (
  req: Request,
  res: Response
) => {
  const { id_session } = req.params as ISession;
  const { id_weather } = req.body as IWeather;
  try {
    const created = await Weather.create(id_session, id_weather);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json(err);
  }
}) as RequestHandler);

sessionsController.delete('/:id_session/weather/:id_weather', (async (
  req: Request,
  res: Response
) => {
  const { id_session, id_weather } = req.params;
  try {
    const destroyed = await Weather.destroy(
      parseInt(id_session, 10),
      parseInt(id_weather, 10)
    );
    destroyed
      ? res.status(204).json('RESSOURCE DELETED')
      : res.status(204).json('RESSOURCE DELETED');
  } catch (err) {
    res.status(500).json(err);
  }
}) as RequestHandler);

sessionsController.delete(
  '/:id_session',
  Auth.getCurrentSession,
  Auth.checkSessionPrivileges,
  (async (req: Request, res: Response, next: NextFunction) => {
    const { id_session } = req.params as ISession;
    try {
      const sessionFound: ISession = await Session.findOne(id_session);
      if (sessionFound) {
        const deletedSession = await Session.destroy(id_session);
        if (deletedSession) {
          return res.status(200).send(sessionFound);
        }
      }
    } catch (err) {
      next(err);
    }
  }) as RequestHandler
);

export default sessionsController;
