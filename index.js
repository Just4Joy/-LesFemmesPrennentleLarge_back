"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var setupRoutes = require('./router').setupRoutes;
var app = express();
var port = process.env.PORT || 3000;
app.use(express.json());
setupRoutes(app);
app.listen(port, function (err) {
    if (err) {
        return console.error(err);
    }
    return console.log("server is listening on " + port);
});
