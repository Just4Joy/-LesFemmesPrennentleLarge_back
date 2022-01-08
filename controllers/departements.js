"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var departement_1 = __importDefault(require("../models/departement"));
var departementsController = express_1.default.Router();
/// /////////////////// GET ALL /////////////////////
departementsController.get('/', function (req, res, next) {
    departement_1.default.findAll()
        .then(function (departements) {
        res.status(200).json(departements);
    })
        .catch(function (err) {
        next(err);
    });
});
exports.default = departementsController;
