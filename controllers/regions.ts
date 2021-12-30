import express = require('express');
import { Request, Response } from 'express';
import Region from '../models/region.model';

const regionController = express.Router();

// regionController.get('/', (req: Request, res: Response) => {
//   res.status(200).send('coucou');
// });

/// /////////////////// GET ALL /////////////////////
regionController.get('/', (req: Request, res: Response) => {
  Region.findAll()
    .then((region: any) => {
      res.status(200).json(region);
    })
    .catch((err: any) => {
      res.status(401).send(err);
    });
});

/// /////////////////// GET ONE BY ID /////////////////////
regionController.get('/:idRegion', (req: Request, res: Response) => {
  const idRegion: number = parseInt(req.params.idRegion, 10);
  Region.findOneById(idRegion).then((region: any) => {
    res.status(200).json(region);
  });
});

export default regionController;
