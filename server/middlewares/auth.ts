import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  user?: any;
  token?: string;
}

const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: any;
    if (req.headers.authorization)
      token = req.headers.authorization.split(" ")[1];

    if (!token)
    {
      res.status(401).json({ message: "Please Login to continue" });
      return;
    }

    const decoded = jwt.verify(token, (process.env.JWT_SECRET || ""));
    console.log(decoded);
    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    console.log(err.message);
    if (err.message == "jwt expired")
    {
      res.status(401).json({ message: "Please Login to continue" });
      return;
    }

    res.status(500).json({ message: err.message });
  }
};

export default verifyToken;
