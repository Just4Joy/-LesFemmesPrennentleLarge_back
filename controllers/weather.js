"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var weather_1 = __importDefault(require("../models/weather"));
var weatherController = express.Router();
weatherController.get('/coucou', function (req, res) {
    res.status(200).send('hibou');
});
weatherController.get('/', function (req, res, next) {
    weather_1.default.findWeather()
        .then(function (weather) {
        res.json(weather);
    })
        .catch(function (err) {
        next(err);
    });
});
exports.default = weatherController;
