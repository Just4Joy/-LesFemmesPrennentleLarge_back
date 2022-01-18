import express, { response } from 'express';
import sessionHasWeather from '../models/sessionhasweather';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ResultSetHeader } from 'mysql2';

const sessionHasWeatherController = express.Router();

sessionHasWeatherController.get('/:id_session', (async (
  req: Request,
  res: Response
) => {
  const { id_session } = req.params;
  const sessionWeather = await sessionHasWeather.getWeatherBySession(
    parseInt(id_session, 10)
  );
  console.log(sessionWeather);
  res.status(200).json(sessionWeather);
}) as RequestHandler);

sessionHasWeatherController.post('/:id_session/:id_weather', (async (
  req: Request,
  res: Response
) => {
  const { id_session, id_weather } = req.params;
  try {
    const created = await sessionHasWeather.create(
      parseInt(id_session, 10),
      parseInt(id_weather, 10)
    );
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json(err);
  }
}) as RequestHandler);

sessionHasWeatherController.delete('/:id_session/:id_weather', (async (
  req: Request,
  res: Response
) => {
  const { id_session, id_weather } = req.params;
  try {
    const created = await sessionHasWeather.destroy(
      parseInt(id_session, 10),
      parseInt(id_weather, 10)
    );
    res.status(204).json('RESSOURCE DELETED');
  } catch (err) {
    res.status(500).json(err);
  }
}) as RequestHandler);

export default sessionHasWeatherController;
