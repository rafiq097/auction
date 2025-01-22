"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_ts_1 = require("../controllers/user.controller.ts");
const router = (0, express_1.Router)();
router.get("/get", user_controller_ts_1.getAllUsers);
router.route("/login").post(user_controller_ts_1.loginUser);
exports.default = router;
