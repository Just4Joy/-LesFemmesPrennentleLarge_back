import express = require('express');
import cors from 'cors';

import setupRoutes from './router';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

setupRoutes(app);

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
