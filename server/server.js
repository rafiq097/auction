"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db/db"));
const auth_1 = __importDefault(require("./middlewares/auth"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'frontend', 'dist')));
// app.use(cors());
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//DB
(0, db_1.default)((process.env.MONGO_URI || ""));
//Routes
app.use("/users", user_routes_1.default);
//Middlewares
app.get('/verify', auth_1.default, (req, res) => {
    console.log("Token Verified");
    res.status(200).json({
        message: "Logged In Successfully",
        token: req.token,
        user: req.user
    });
});
//Server
const PORT = process.env.PORT || 5000;
// app.get("/", (req, res) => {
//     res.send("<h1>SAD</h1>");
// })
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
