const express = require('express');
import { Request, Response } from 'express';

const app = express();
const port: number = 3000;
app.get('/', (req: Request, res: Response) => {
  res.send('Vive le curry!');
});
app.listen(port, (err: Error) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});
