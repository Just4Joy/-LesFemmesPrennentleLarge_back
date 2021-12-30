import { Request, Response } from 'express';
import express = require('express');
import Weather from '../models/weather.model';

const weatherController = express.Router();

weatherController.get('/coucou', (req: Request, res: Response) => {
  res.status(200).send('hibou');
});

weatherController.get('/', (req: Request, res: Response) => {
  Weather.findWeather()
    .then((weather: any) => {
      res.json(weather);
    })
    .catch((err: any) => {
      console.log(err);
      res.status(500).send('Error retrieving weather from database');
    });
});

export default weatherController;
