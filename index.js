"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var errors_1 = require("./helpers/errors");
var cors_1 = __importDefault(require("cors"));
require("dotenv/config");
var index_1 = __importDefault(require("./controllers/index"));
var app = express();
var port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors_1.default());
app.use(cookie_parser_1.default());
index_1.default(app);
// A mettre à la fin pour gèrer les erreurs qui sortiront des routes
app.use(errors_1.handleError);
app.listen(port, function () {
    console.log("server is listening on " + port);
});
