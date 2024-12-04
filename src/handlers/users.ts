import express, { Request, Response } from 'express'
import { User, UserStore } from '../models/user'

const store = new UserStore()

const index = async (_req: Request, res: Response) => {
    try {
        const users = await store.index();
        res.status(200).json(users);
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}
  
const show = async (req: Request, res: Response) => {
    try {
       const user = await store.show(req.params.id);
       res.status(200).json(user);
    } catch (err) {
       res.status(400)
       res.json(err)
    }
}

const create = async (req: Request, res: Response) => {
  const user: User = {
      fisrtName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password
  }
  try {
      const newUser = await store.create(user)
      const token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET);
      res.status(201).json(token)
  } catch(err) {
      res.status(400)
      res.json(String(err) + user)
  }
}

const authenticate = async (req: Request, res: Response) => {
  const user: User = {
    fisrtName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password
  }
  try {
      const u = await store.authenticate(user.fisrtName, user.lastName, user.password)
      const token = jwt.sign({ user: u }, process.env.TOKEN_SECRET);
      res.status(200).json(token)
  } catch(error) {
      res.status(401)
      res.json({ error })
  }
}

const update = async (req: Request, res: Response) => {
  const user: User = {
      id: parseInt(req.params.id),
      fisrtName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password
  }
  try {
      const authorizationHeader = req.headers.authorization
      const token = authorizationHeader.split(' ')[1]
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
      if(decoded.id !== user.id) {
          throw new Error('User id does not match!')
      }
  } catch(err) {
      res.status(401)
      res.json(err)
      return
  }

  try {
      const updated = await store.create(user)
      res.status(200).json(updated)
  } catch(err) {
      res.status(400)
      res.json(String(err) + user)
  }
}
   
const destroy = async (req: Request, res: Response) => {
    try {
       const deleted = await store.delete(req.params.id);
       res.status(200).json(deleted);
    } catch (err) {
       res.status(400)
       res.json(err)
    }
}


const usersRoutes = (app: express.Application) => {
    app.get('/users', index);
    app.get('/users/:id', show);
    app.delete('/users/:id', destroy);
    app.post('/users', create);
    app.put('/users', update);
    app.post('/users/authenticate', authenticate);
}

export default usersRoutes