import express = require('express');

import setupRoutes from './router';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

setupRoutes(app);

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
