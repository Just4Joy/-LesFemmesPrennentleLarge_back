"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_config_1 = __importDefault(require("../helpers/db-config"));
var argon2_1 = __importDefault(require("argon2"));
var joi_1 = __importDefault(require("joi"));
var errors_1 = require("../helpers/errors");
var hashingOptions = {
    type: argon2_1.default.argon2id,
    memoryCost: Math.pow(2, 16),
    timeCost: 5,
    parallelism: 1,
};
var hashPassword = function (password) {
    return argon2_1.default.hash(password, hashingOptions);
};
var verifyPassword = function (password, hashedPassword) {
    return argon2_1.default.verify(hashedPassword, password, hashingOptions);
};
var validateUser = function (req, res, next) {
    var required = 'optional';
    if (req.method === 'POST') {
        required = 'required';
    }
    var errors = joi_1.default.object({
        firstname: joi_1.default.string().max(100).presence(required),
        lastname: joi_1.default.string().max(100).presence(required),
        city: joi_1.default.string().max(100).presence(required),
        email: joi_1.default.string().email().max(100).presence(required),
        password: joi_1.default.string().min(8).max(15).presence(required),
        zipCode: joi_1.default.string().max(45).presence(required),
        idSurfSkill: joi_1.default.number().presence(required),
        favoriteSpot: joi_1.default.string().max(45).presence(required),
        idDepartement: joi_1.default.number().presence(required),
        idSurfStyle: joi_1.default.number().presence(required),
        admin: joi_1.default.boolean().optional(),
    }).validate(req.body, { abortEarly: false }).error;
    if (errors) {
        next(new errors_1.ErrorHandler(422, errors.message));
    }
    else {
        next();
    }
};
var validateLogin = function (req, res, next) {
    var errors = joi_1.default.object({
        email: joi_1.default.string().email().max(255).required(),
        password: joi_1.default.string().min(8).max(15).required(),
    }).validate(req.body, { abortEarly: false }).error;
    if (errors) {
        next(new errors_1.ErrorHandler(422, errors.message));
    }
    else {
        next();
    }
};
var findMany = function () {
    var sql = 'SELECT * FROM users';
    return db_config_1.default
        .promise()
        .query(sql, [])
        .then(function (_a) {
        var results = _a[0];
        return results;
    });
};
var findByEmail = function (email) {
    return db_config_1.default
        .promise()
        .query('SELECT * FROM users where email = ?', [email])
        .then(function (_a) {
        var results = _a[0];
        return results[0];
    });
};
var findOneById = function (id) {
    return db_config_1.default
        .promise()
        .query('SELECT * FROM users where id_user = ?', [id])
        .then(function (_a) {
        var results = _a[0];
        return results[0];
    });
};
var update = function (data, id) {
    return db_config_1.default
        .promise()
        .query('UPDATE users SET ? WHERE id_user = ?', [data, id])
        .then(function (_a) {
        var results = _a[0];
        return results;
    });
};
var destroy = function (id) {
    return db_config_1.default
        .promise()
        .query('DELETE FROM users WHERE id_user = ?', [id]);
};
var create = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var createdDateServ, firstname, lastname, city, email, password, zipCode, profilePic, idSurfSkill, favoriteSpot, createdDate, idDepartement, idSurfStyle, hashedPassword;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(payload);
                createdDateServ = new Date().toISOString().slice(0, 19).replace('T', ' ');
                console.log(createdDateServ);
                firstname = payload.firstname, lastname = payload.lastname, city = payload.city, email = payload.email, password = payload.password, zipCode = payload.zipCode, profilePic = payload.profilePic, idSurfSkill = payload.idSurfSkill, favoriteSpot = payload.favoriteSpot, createdDate = payload.createdDate, idDepartement = payload.idDepartement, idSurfStyle = payload.idSurfStyle;
                return [4 /*yield*/, hashPassword(password)];
            case 1:
                hashedPassword = _a.sent();
                return [2 /*return*/, db_config_1.default
                        .promise()
                        .query('INSERT INTO users (firstname, lastname, city, email, password, zip_code, profile_pic, id_surf_skill, favorite_spot, created_date, id_departement, id_surf_style) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [
                        firstname,
                        lastname,
                        city,
                        email,
                        hashedPassword,
                        zipCode,
                        profilePic,
                        idSurfSkill,
                        favoriteSpot,
                        createdDateServ,
                        idDepartement,
                        idSurfStyle,
                    ])];
        }
    });
}); };
var User = {
    findMany: findMany,
    create: create,
    findByEmail: findByEmail,
    findOneById: findOneById,
    update: update,
    destroy: destroy,
    validateUser: validateUser,
    validateLogin: validateLogin,
    verifyPassword: verifyPassword,
};
exports.default = User;
