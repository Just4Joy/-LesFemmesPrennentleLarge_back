"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_config_1 = __importDefault(require("../helpers/db-config"));
var findAll = function () {
    return db_config_1.default
        .promise()
        .query('SELECT * FROM regions')
        .then(function (_a) {
        var region = _a[0];
        return region;
    });
};
var findOneById = function (idRegion) {
    return db_config_1.default
        .promise()
        .query('SELECT * FROM regions WHERE id_region = ?', [idRegion])
        .then(function (_a) {
        var region = _a[0][0];
        return region;
    });
};
var Region = {
    findAll: findAll,
    findOneById: findOneById,
};
exports.default = Region;
