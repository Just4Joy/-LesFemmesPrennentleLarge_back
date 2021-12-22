import { Request, Response, NextFunction } from 'express';
import express = require('express');
import SurfStyle from '../models/surfstyle';
import ISurfStyle from '../interfaces/ISurfstyle';
const surfStyleController = express.Router();

surfStyleController.get('/coucou', (req: Request, res: Response) => {
  res.status(200).send('hibou');
});

surfStyleController.get('/', (req: Request, res: Response, next: NextFunction) => {
  SurfStyle.findSurfStyles()
    .then((surfstyles: ISurfStyle[]) => {
      res.json(surfstyles);
    })
    .catch((err: Error) => {
      next(err)
    });
});

export default surfStyleController;
