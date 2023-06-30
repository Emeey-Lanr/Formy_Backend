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
exports.submitFormV = exports.fillFormV = void 0;
const db_1 = require("../db");
const fillFormV = (link) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = new Date;
        const lookedForForm = yield db_1.pool.query("SELECT userid, form_title, form_description, form_details, form_time,  form_date FROM form WHERE form_link = $1", [link]);
        if (lookedForForm.rows.length === 0) {
            return new Error("Invalid Acess Link/404");
        }
        const todayDate = date.getFullYear() + (date.getMonth() + 1) + date.getDate();
        const todayTime = date.getHours() + date.getMinutes();
        let ifDateIsNotEmpty = lookedForForm.rows[0].form_date !== "";
        const setTime = lookedForForm.rows[0].form_time.split(":");
        const addSetTime = Number(setTime[0]) + Number(setTime[1]);
        const expiringDate = Number(lookedForForm.rows[0].form_date.split("-")[0]) + Number(lookedForForm.rows[0].form_date.split("-")[1]) + Number(lookedForForm.rows[0].form_date.split("-")[2]);
        const returnErrorData = (data) => {
            return data;
        };
        if (ifDateIsNotEmpty && lookedForForm.rows[0].form_time !== "") {
            if (todayDate <= expiringDate && todayTime <= addSetTime) {
                return returnErrorData(lookedForForm.rows[0]);
            }
            else {
                return returnErrorData(new Error("Form has expired/404"));
            }
        }
        else if (ifDateIsNotEmpty && lookedForForm.rows[0].form_time === "") {
            if (todayDate <= expiringDate) {
                return returnErrorData(lookedForForm.rows[0]);
            }
            else {
                return returnErrorData(new Error("Form has expired/404"));
            }
        }
        else {
            return returnErrorData(lookedForForm.rows[0]);
        }
    }
    catch (error) {
        console.log(error);
        return new Error(`Internal Error/500`);
    }
});
exports.fillFormV = fillFormV;
const submitFormV = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { form_link, user_email } = data;
    try {
        const checkIfAlreadySubmitted = yield db_1.pool.query("SELECT user_email FROM register WHERE form_link = $1 AND user_email = $2", [form_link, user_email]);
        if (checkIfAlreadySubmitted.rows.length > 0) {
            return new Error("You've submitted with this Email Already");
        }
        const submitDetails = [data.form_title, data.form_description, form_link, user_email, JSON.stringify(data.form_details), JSON.stringify([]), data.owner_id];
        const submit = yield db_1.pool.query("INSERT INTO register(form_title, form_description ,form_link , user_email , form_details , submit_details , owner_id) VALUES($1,$2,$3,$4,$5 , $6, $7)", submitDetails);
        return submit;
    }
    catch (error) {
        console.log(error);
        return new Error(error.message);
    }
});
exports.submitFormV = submitFormV;
