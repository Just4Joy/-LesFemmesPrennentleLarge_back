"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_config_1 = __importDefault(require("../helpers/db-config"));
var db = db_config_1.default.promise();
var findSurfSkills = function () {
    var sql = "SELECT * FROM surf_skills";
    return db.query(sql).then(function (_a) {
        var results = _a[0];
        return results;
    });
};
var SurfSkills = {
    findSurfSkills: findSurfSkills,
};
exports.default = SurfSkills;
