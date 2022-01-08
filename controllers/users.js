"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var express_1 = __importDefault(require("express"));
var user_1 = __importDefault(require("../models/user"));
var validator_1 = __importDefault(require("../_utils/validator"));
var Auth = __importStar(require("../helpers/auth"));
var userController = express_1.default.Router();
userController.get('/', (function (_req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, user_1.default.findMany()];
            case 1:
                result = _a.sent();
                res.status(200).json(result);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                next(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); }));
userController.get('/:id', (function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, user_1.default.findOneById(id)];
            case 2:
                result = _a.sent();
                console.log(result);
                res.status(200).json(result);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                next(err_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); }));
userController.post('/', user_1.default.validateUser, (function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validation, email, existingEmail, user, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                validation = validator_1.default.validate(req.body);
                if (validation.error) {
                    return [2 /*return*/, res.status(422).json(validation.error.message)];
                }
                email = req.body.email;
                return [4 /*yield*/, user_1.default.findByEmail(email)];
            case 1:
                existingEmail = _a.sent();
                if (existingEmail) {
                    return [2 /*return*/, res.status(400).json('BAD REQUEST EMAIL ALREADY EXIST')];
                }
                user = req.body;
                return [4 /*yield*/, user_1.default.create(user)];
            case 2:
                response = _a.sent();
                return [2 /*return*/, res.status(200).json(__assign({ id_user: response[0].insertId }, req.body))];
        }
    });
}); }));
userController.put('/:idUser', Auth.getCurrentSession, user_1.default.validateUser, (function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var idUser, foundUser, UpdatedUser, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                idUser = req.params.idUser;
                return [4 /*yield*/, user_1.default.findOneById(parseInt(idUser, 10))];
            case 1:
                foundUser = _a.sent();
                console.log(foundUser);
                if (!foundUser[0]) return [3 /*break*/, 3];
                return [4 /*yield*/, user_1.default.update(req.body, parseInt(idUser, 10))];
            case 2:
                UpdatedUser = _a.sent();
                console.log(UpdatedUser);
                return [2 /*return*/, res.status(201).send('USER MODIFIED')];
            case 3: return [2 /*return*/, res.status(401).send('USER NOT FOUND')];
            case 4:
                err_3 = _a.sent();
                console.log(err_3);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); }));
userController.delete('/:idUser', Auth.getCurrentSession, (function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var idUser, deletedUser, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                idUser = req.params.idUser;
                return [4 /*yield*/, user_1.default.destroy(parseInt(idUser, 10))];
            case 1:
                deletedUser = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                console.log(err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); }));
exports.default = userController;
