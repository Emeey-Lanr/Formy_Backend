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
Object.defineProperty(exports, "__esModule", { value: true });
exports.formRegistrationDetails = exports.deleteForm = exports.getFormLink = exports.addForm = void 0;
const form_validator_1 = require("../Validator/form.validator");
const response_1 = require("../Response/response");
const db_1 = require("../db");
const uuid_1 = require("uuid");
const addForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, form_title, form_description, form_details, form_time, form_date } = req.body;
    try {
        let check = yield (0, form_validator_1.checkIfFormExist)(userId, form_title);
        if (check) {
            (0, response_1.errorResponse)(res, 404, false, "form title exist in your collection");
        }
        else {
            const link = (0, uuid_1.v4)();
            const formQueryDetails = [userId, form_title, form_description, JSON.stringify(form_details), link, form_time, form_date];
            let addForm = yield db_1.pool.query("INSERT INTO form(userId,form_title, form_description, form_details, form_link, form_time, form_date) VALUES($1,$2,$3,$4,$5,$6,$7)", formQueryDetails);
            (0, response_1.sucessResponse)(res, 200, true, "form created succesfully", addForm.rows);
        }
    }
    catch (error) {
        (0, response_1.errorResponse)(res, 404, false, `${error.message}`);
    }
});
exports.addForm = addForm;
const getFormLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const details = yield (0, form_validator_1.getformValidator)(req);
        (0, response_1.sucessResponse)(res, 200, true, "seen succesfully", details);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, 400, false, "Authentication failed");
    }
});
exports.getFormLink = getFormLink;
const deleteForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteFormQuery = yield db_1.pool.query("DELETE FROM form WHERE  form_link = $1", [req.params.id]);
        const deleteRegistration = yield db_1.pool.query("DELETE FROM register WHERE form_link = $1", [req.params.id]);
        (0, response_1.sucessResponse)(res, 200, true, "deleted succesfully", []);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, 404, false, error.message);
    }
});
exports.deleteForm = deleteForm;
const formRegistrationDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const form_link = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        const formLink = yield db_1.pool.query("SELECT form_title, form_link, form_description FROM form WHERE form_link = $1", [form_link]);
        if (formLink.rows.length > 0) {
            const user = yield db_1.pool.query("SELECT * FROM register WHERE form_link = $1", [form_link]);
            (0, response_1.sucessResponse)(res, 200, true, "Valid access link", { details: formLink.rows[0], data: user.rows });
        }
        else {
            (0, response_1.errorResponse)(res, 404, false, "Invalid access link");
        }
    }
    catch (error) {
        (0, response_1.errorResponse)(res, 500, false, 'Internal Server Error');
    }
});
exports.formRegistrationDetails = formRegistrationDetails;
