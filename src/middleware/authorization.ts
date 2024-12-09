import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: () => void
) => {
  try {
    const authorizationHeader = String(req.headers.authorization);
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.verify(token, String(process.env.TOKEN_SECRET));

    req.body.decoded = decoded;
    next();
  } catch (error) {
    res.status(401).json(error);
  }
};
