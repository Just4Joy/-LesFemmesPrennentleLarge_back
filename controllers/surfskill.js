"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var surfskill_1 = __importDefault(require("../models/surfskill"));
var surfskillsController = express.Router();
surfskillsController.get('/coucou', function (req, res) {
    res.status(200).send('hibou');
});
surfskillsController.get('/', function (req, res, next) {
    surfskill_1.default.findSurfSkills()
        .then(function (surfskill) {
        res.json(surfskill);
    })
        .catch(function (err) {
        next(err);
    });
});
exports.default = surfskillsController;
