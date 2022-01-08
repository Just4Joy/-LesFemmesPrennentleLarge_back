"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var surfstyle_1 = __importDefault(require("../models/surfstyle"));
var surfStyleController = express_1.default.Router();
surfStyleController.get('/coucou', function (req, res) {
    res.status(200).send('hibou');
});
surfStyleController.get('/', function (req, res, next) {
    surfstyle_1.default.findAll()
        .then(function (surfstyles) {
        res.json(surfstyles);
    })
        .catch(function (err) {
        next(err);
    });
});
exports.default = surfStyleController;
