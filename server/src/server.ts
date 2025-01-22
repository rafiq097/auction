import express, { Application, Request, Response } from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

import db from "./db/db";
import verifyToken from "./middlewares/auth";
import userRoutes from "./routes/user.routes";

dotenv.config();
const app: Application = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../..', 'client', 'dist')));
// app.use(cors());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//DB
db(process.env.MONGO_URI);

//Routes
app.use("/users", userRoutes);

//Middlewares
app.get('/verify', verifyToken, (req: any, res: Response) => {
    console.log("Token Verified");

    res.status(200).json({
        message: "Logged In Successfully",
        token: req.token,
        user: req.user
    })
});

//Server
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.send("<h1>SAD</h1>");
})

// app.get('*', (req: Request, res: Response) => {
//     res.sendFile(path.join(__dirname, '../..', 'client', 'dist', 'index.html'));
// });

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})