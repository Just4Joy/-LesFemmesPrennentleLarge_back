import { Request, Response, NextFunction } from 'express';
import express = require('express');
import Weather from '../models/weather';
import IWeather from '../interfaces/IWeather';

const weatherController = express.Router();

weatherController.get('/coucou', (req: Request, res: Response) => {
  res.status(200).send('hibou');
});

weatherController.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    Weather.findAll()
      .then((weather: IWeather[]) => {
        res.json(weather);
      })
      .catch((err) => {
        next(err);
      });
  }
);

export default weatherController;
