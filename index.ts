const express = require('express');
import { Request, Response } from 'express';
const { setupRoutes } = require('./router')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

setupRoutes(app);






app.listen(port, (err: Error) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});
