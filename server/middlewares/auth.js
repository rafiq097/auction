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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token;
        if (req.headers.authorization)
            token = req.headers.authorization.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Please Login to continue" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, (process.env.JWT_SECRET || ""));
        console.log(decoded);
        req.user = decoded;
        req.token = token;
        next();
    }
    catch (err) {
        console.log(err.message);
        if (err.message == "jwt expired") {
            res.status(401).json({ message: "Please Login to continue" });
            return;
        }
        res.status(500).json({ message: err.message });
    }
});
exports.default = verifyToken;
