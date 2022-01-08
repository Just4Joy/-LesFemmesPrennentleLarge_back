"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_config_1 = __importDefault(require("../helpers/db-config"));
var findAll = function () {
    return db_config_1.default
        .promise()
        .query('SELECT * FROM departments')
        .then(function (_a) {
        var departements = _a[0];
        return departements;
    });
};
exports.default = {
    findAll: findAll,
};
