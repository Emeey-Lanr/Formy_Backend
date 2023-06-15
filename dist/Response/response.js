"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sucessResponse = exports.errorResponse = void 0;
const errorResponse = (res, statusCode, sucess, message) => {
    res.status(statusCode).json({
        sucess: sucess,
        message: message,
    });
};
exports.errorResponse = errorResponse;
const sucessResponse = (res, statusCode, sucess, message, data) => {
    res.status(statusCode).json({
        sucess: sucess,
        message: message,
        data: data
    });
};
exports.sucessResponse = sucessResponse;
