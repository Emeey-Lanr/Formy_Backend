"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const userRoute_1 = require("./userRoute");
const formRoute_1 = require("./formRoute");
const register_1 = require("./register");
const routes = (app) => {
    app.use("/user", userRoute_1.userRoute);
    app.use("/form", formRoute_1.formRoute);
    app.use("/register", register_1.registerRoute);
};
exports.routes = routes;
