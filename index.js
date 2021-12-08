Object.defineProperty(exports, '__esModule', { value: true });
const express = require('express');

const app = express();
const port = 3000;
app.get('/', function (req, res) {
  res.send('Vive le curry!');
});
app.listen(port, function (err) {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});
