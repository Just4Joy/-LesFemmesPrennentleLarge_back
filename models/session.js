"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_config_1 = __importDefault(require("../helpers/db-config"));
var joi_1 = __importDefault(require("joi"));
var errors_1 = require("../helpers/errors");
var findSession = function () {
    return db_config_1.default
        .promise()
        .query('SELECT * FROM sessions', [])
        .then(function (_a) {
        var results = _a[0];
        return results;
    });
};
var create = function (session) {
    var name = session.name, date = session.date, spot_name = session.spot_name, adress = session.adress, nb_hiki_max = session.nb_hiki_max, id_departement = session.id_departement, id_surf_style = session.id_surf_style;
    return db_config_1.default
        .promise()
        .query('INSERT INTO sessions (name, date, spot_name, adress, nb_hiki_max, id_departement, id_surf_style) VALUES (?,?,?,?,?,?,?)', [
        name,
        date,
        spot_name,
        adress,
        nb_hiki_max,
        id_departement,
        id_surf_style,
    ])
        .then(function (_a) {
        var results = _a[0];
        return results.insertId;
    });
};
var findOne = function (id_session) {
    return db_config_1.default
        .promise()
        .query('SELECT * FROM sessions WHERE id_session = ?', [
        id_session,
    ])
        .then(function (_a) {
        var results = _a[0];
        return results[0];
    });
};
var update = function (id_session, newAttributes) {
    return db_config_1.default
        .promise()
        .query('UPDATE sessions SET ? WHERE id_session = ?', [
        newAttributes,
        id_session,
    ])
        .then(function (_a) {
        var results = _a[0];
        return results.affectedRows === 1;
    });
};
var sessionExists = function (req, res, next) {
    // Récupèrer l'id user de req.params
    var idSession = req.params.idSession;
    // Vérifier si le user existe
    findOne(Number(idSession))
        .then(function (sessionExists) {
        // Si non, => erreur
        if (!sessionExists) {
            next(new errors_1.ErrorHandler(404, "This session doesn't exist"));
        }
        // Si oui => next
        else {
            next();
        }
    })
        .catch(function (err) { return next(err); });
};
var validateSession = function (req, res, next) {
    var required = 'optional';
    if (req.method === 'POST') {
        required = 'required';
    }
    var errors = joi_1.default.object({
        name: joi_1.default.string().min(3).max(100).presence(required),
        date: joi_1.default.date().presence(required),
        spot_name: joi_1.default.string().min(2).max(100).presence(required),
        adress: joi_1.default.string().min(2).max(255).presence(required),
        nb_hiki_max: joi_1.default.number().integer().presence(required),
        id_departement: joi_1.default.number().integer().presence(required),
        id_surf_style: joi_1.default.number().integer().presence(required),
        carpool: joi_1.default.number().integer().presence(required)
    }).validate(req.body, { abortEarly: false }).error;
    if (errors) {
        next(new errors_1.ErrorHandler(422, errors.message));
    }
    else {
        next();
    }
};
exports.default = {
    findSession: findSession,
    create: create,
    validateSession: validateSession,
    findOne: findOne,
    update: update,
    sessionExists: sessionExists,
};
