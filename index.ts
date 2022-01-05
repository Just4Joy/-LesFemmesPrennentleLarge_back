import express = require('express');
import cookieParser from 'cookie-parser';
import { handleError } from './helpers/errors';
import cors from 'cors';
import 'dotenv/config';
// import fileUpload from 'express-fileupload';

import setupRoutes from './controllers/index';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

//Options par défault de fileUpload
// app.use(fileUpload());

setupRoutes(app);

// A mettre à la fin pour gèrer les erreurs qui sortiront des routes
app.use(handleError);

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
