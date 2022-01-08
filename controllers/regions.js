"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var region_1 = __importDefault(require("../models/region"));
var regionController = express_1.default.Router();
// regionController.get('/', (req: Request, res: Response) => {
//   res.status(200).send('coucou');
// });
/// /////////////////// GET ALL /////////////////////
regionController.get('/', function (req, res, next) {
    region_1.default.findAll()
        .then(function (regions) {
        res.status(200).json(regions);
    })
        .catch(function (err) {
        next(err);
    });
});
/// /////////////////// GET ONE BY ID /////////////////////
regionController.get('/:idRegion', function (req, res, next) {
    var idRegion = parseInt(req.params.idRegion, 10);
    region_1.default.findOneById(idRegion)
        .then(function (region) {
        res.status(200).json(region);
    })
        .catch(function (err) {
        next(err);
    });
});
exports.default = regionController;
