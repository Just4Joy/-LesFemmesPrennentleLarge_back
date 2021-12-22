import express = require('express');
import cookieParser from 'cookie-parser';
import { handleError } from './helpers/errors';
import cors from 'cors';
import 'dotenv/config';

import setupRoutes from './router';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

setupRoutes(app);

// A mettre à la fin pour gèrer les erreurs qui sortiront des routes
app.use(handleError);

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
