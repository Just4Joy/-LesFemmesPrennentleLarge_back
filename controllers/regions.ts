import express from 'express';
import { Request, Response, NextFunction } from 'express';
import Region from '../models/region';
import IRegion from '../interfaces/IRegion';
const regionController = express.Router();

/// /////////////////// GET ALL /////////////////////
regionController.get('/', (req: Request, res: Response, next: NextFunction) => {
  Region.findAll()
    .then((regions: IRegion[]) => {
      res.status(200).json(regions);
    })
    .catch((err: Error) => {
      next(err);
    });
});

/// /////////////////// GET ONE BY ID /////////////////////
regionController.get(
  '/:idRegion',
  (req: Request, res: Response, next: NextFunction) => {
    const idRegion: number = parseInt(req.params.idRegion, 10);
    Region.findOneById(idRegion)
      .then((region: IRegion) => {
        res.status(200).json(region);
      })
      .catch((err: Error) => {
        next(err);
      });
  }
);

export default regionController;
