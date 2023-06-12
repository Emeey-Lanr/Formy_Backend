"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = __importDefault(require("pg"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pg = pg_1.default.Pool;
exports.pool = new pg({
    user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASS}`,
    host: `${process.env.DB_HOST}`,
    port: Number(process.env.DB_PORT),
    database: `${process.env.DB_CONNECTED_DB}`,
});
