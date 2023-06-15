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
exports.addForm = void 0;
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
            console.log(link);
            const formQueryDetails = [userId, form_title, form_description, JSON.stringify(form_details), link, form_time, form_date];
            let addForm = yield db_1.pool.query("INSERT INTO form(userId,form_title, form_description, form_details, form_link, form_time, form_date) VALUES($1,$2,$3,$4,$5,$6,$7)", formQueryDetails);
            (0, response_1.sucessResponse)(res, 202, true, "form created succesfully", addForm.rows);
        }
    }
    catch (error) {
        (0, response_1.errorResponse)(res, 404, false, `${error.message}`);
    }
});
exports.addForm = addForm;
