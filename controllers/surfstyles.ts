import { Request, Response } from 'express';
import express = require('express');
import SurfStyle from '../models/surfstyle.model';

const surfStyleController = express.Router();

surfStyleController.get('/coucou', (req: Request, res: Response) => {
  res.status(200).send('hibou');
});

surfStyleController.get('/', (req: Request, res: Response) => {
  SurfStyle.findSurfStyles()
    .then((surfstyles: any) => {
      res.json(surfstyles);
    })
    .catch((err: any) => {
      console.log(err);
      res.status(500).send('Error retrieving surfstyles from database');
    });
});

export default surfStyleController;
