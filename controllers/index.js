"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var users_1 = __importDefault(require("../controllers/users"));
var surfstyles_1 = __importDefault(require("../controllers/surfstyles"));
var usertypes_1 = __importDefault(require("../controllers/usertypes"));
var regions_1 = __importDefault(require("../controllers/regions"));
var sessions_1 = __importDefault(require("../controllers/sessions"));
var departements_1 = __importDefault(require("../controllers/departements"));
var weather_1 = __importDefault(require("./weather"));
var surfskill_1 = __importDefault(require("./surfskill"));
var auth_1 = __importDefault(require("./auth"));
var setupRoutes = function (app) {
    app.use('/api/users', users_1.default);
    app.use('/api/surfstyle', surfstyles_1.default);
    app.use('/api/usertype', usertypes_1.default);
    app.use('/api/regions', regions_1.default);
    app.use('/api/sessions', sessions_1.default);
    app.use('/api/departements', departements_1.default);
    app.use('/api/weather', weather_1.default);
    app.use('/api/surfskill', surfskill_1.default);
    app.use('/api/login', auth_1.default);
};
exports.default = setupRoutes;
