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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.loginUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_ts_1 = __importDefault(require("../models/user.model.ts"));
const toIST = (date) => {
    const IST = 5.5 * 60 * 60 * 1000;
    return new Date(date.getTime());
};
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("login called");
    try {
        console.log(req.body);
        const { email, name } = req.body;
        if (!email || !name)
            return res.status(400).json({ message: "Incorrect Details" });
        let user = yield user_model_ts_1.default.findOne({ email: email });
        if (!user) {
            user = new user_model_ts_1.default({ email, name });
            yield user.save();
            console.log(user);
        }
        const currentIST = toIST(new Date());
        yield user_model_ts_1.default.findByIdAndUpdate(user._id, { time: currentIST }, { new: true });
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email, name: user.name }, (process.env.JWT_SECRET || ""), { expiresIn: "30d" });
        res.status(200).json({
            message: "Logged In Successfully",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.loginUser = loginUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_ts_1.default.find({});
        res.status(200).send({ users: users });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getAllUsers = getAllUsers;
