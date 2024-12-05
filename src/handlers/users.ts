import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { verifyAuthToken } from '../middleware/authorization';

const store = new UserStore();
dotenv.config();

const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const user = await store.show(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

const create = async (req: Request, res: Response) => {
  const user: User = {
    fisrtName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password
  };
  try {
    const newUser = await store.create(user);
    const token = jwt.sign({ user: newUser }, String(process.env.TOKEN_SECRET));
    res.status(201).json(token);
  } catch (err) {
    res.status(400).json(String(err) + user);
  }
};

const authenticate = async (req: Request, res: Response) => {
  const user: User = {
    id: parseInt(req.params.id),
    fisrtName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password
  };
  try {
    const u = await store.authenticate(
      user.id,
      user.password
    );
    const token = jwt.sign({ user: u }, String(process.env.TOKEN_SECRET));
    res.status(200).json(token);
  } catch (error) {
    res.status(401).json({ error });
  }
};

const update = async (req: Request, res: Response) => {
  const user: User = {
    id: parseInt(req.params.id),
    fisrtName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password
  };

  try { 
    if (req.body.decoded.user.id !== user.id) {
      throw new Error('User id does not match!');
    }
    const updated = await store.update(user);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json(String(err) + user.id);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(req.params.id);
    res.status(200).json(deleted);
  } catch (err) {
    res.status(400).json(err);
  }
};

const usersRoutes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.delete('/users/:id', verifyAuthToken, destroy);
  app.post('/users', verifyAuthToken, create);
  app.put('/users/:id', verifyAuthToken, update);
  app.post('/users/authenticate/:id', authenticate);
};

export default usersRoutes;