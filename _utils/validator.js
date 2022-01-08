"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = __importDefault(require("joi"));
var Schema = joi_1.default.object({
    firstname: joi_1.default.string().min(3).max(100),
    lastname: joi_1.default.string().min(3).max(100),
    city: joi_1.default.string().min(3).max(100),
    email: joi_1.default.string().email().max(100).required(),
    password: joi_1.default.string().min(8).required(),
    zipCode: joi_1.default.string().max(45),
    profilePic: joi_1.default.object(),
    idSurfSkill: joi_1.default.number(),
    favoriteSpot: joi_1.default.string().max(45),
    createdDate: joi_1.default.date(),
    idDepartement: joi_1.default.number(),
    idSurfStyle: joi_1.default.number(),
});
exports.default = Schema;
