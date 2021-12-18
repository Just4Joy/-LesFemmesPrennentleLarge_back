const regionController = require('express').Router();
const Region = require('../models/region.model');
import { Request, Response } from 'express';

// regionController.get('/', (req: Request, res: Response) => {
//   res.status(200).send('coucou');
// });

////////////////////// GET ALL /////////////////////
regionController.get('/', (req: Request, res: Response) => {
  Region.findAll().then((region: any) => {
    res.status(200).json(region);
  });
});

////////////////////// GET ONE BY ID /////////////////////
regionController.get('/:id_region', (req: Request, res: Response) => {
  const id_region = req.params.id_region;
  Region.findOneById(id_region).then((region: any) => {
    res.status(200).json(region);
  });
});

module.exports = { regionController };
