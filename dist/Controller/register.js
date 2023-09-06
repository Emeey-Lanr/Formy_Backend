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
exports.deleteForm = exports.submitForm = exports.getForm = void 0;
const db_1 = require("../db");
const response_1 = require("../Response/response");
const response_2 = require("../Response/response");
const register_Validator_1 = require("../Validator/register.Validator");
const getForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const link = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    const checkBefore = yield (0, register_Validator_1.fillFormV)(`${link}`);
    if (checkBefore instanceof Error) {
        (0, response_2.errorResponse)(res, Number(checkBefore.message.split("/")[1]), false, checkBefore.message.split("/")[0]);
    }
    else {
        (0, response_1.sucessResponse)(res, 200, true, "Valid Acesss Link", checkBefore);
    }
});
exports.getForm = getForm;
const submitForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Don't forget to work on the form extra details
    const submit = yield (0, register_Validator_1.submitFormV)(req.body);
    if (submit instanceof Error) {
        (0, response_2.errorResponse)(res, 401, false, submit.message);
    }
    else {
        (0, response_1.sucessResponse)(res, 200, true, "submitted succesfully", submit.rows);
    }
});
exports.submitForm = submitForm;
const deleteForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteForm = yield db_1.pool.query("DELETE FROM register WHERE id = $1", [Number(req.params.id)]);
        (0, response_1.sucessResponse)(res, 200, true, "Deleted Successfully");
    }
    catch (error) {
        (0, response_2.errorResponse)(res, 500, false, `${error.message}`);
    }
});
exports.deleteForm = deleteForm;
