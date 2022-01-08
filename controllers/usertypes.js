"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var usertype_1 = __importDefault(require("../models/usertype"));
var userTypeController = express_1.default.Router();
userTypeController.get('/coucou', function (req, res) {
    res.status(200).send('hibou');
});
userTypeController.get('/', function (req, res, next) {
    usertype_1.default.findAll()
        .then(function (usertypes) {
        res.json(usertypes);
    })
        .catch(function (err) {
        next(err);
    });
});
exports.default = userTypeController;
