import express, { Request, Response } from 'express'
import { Article, ArticleStore } from '../models/article'

const store = new ArticleStore()


const index = (_req: Request, res: Response) => {
    try {
        const articles = await store.index();
        res.json(articles);
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}
  
const show = (req: Request, res: Response) => {
    try {
       const article = await store.show(req.params.id);
       res.json(article);
    } catch (err) {
       res.status(400)
       res.json(err)
    }
}
  
const create = (req: Request, res: Response) => {
    const article: Article = {
      title: req.body.title,
      content: req.body.content
    }
    try {
       const result = await store.post(article);
       res.json(result);
    } catch (err) {
       res.status(400)
       res.json(err)
    }
}
  
const destroy = (req: Request, res: Response) => {
    try {
       const deleted = await store.delete(rez.params.id);
       res.json(deleted);
    } catch (err) {
       res.status(400)
       res.json(err)
    }
}


const articleRoutes = (app: express.Application) => {
    app.get('/articles', index);
    app.get('/articles/:id', show);
    app.delete('/articles/:id', destroy);
    app.post('/articles', create);
}

export default articleRoutes


//////////////////////////////////////////////////


// @ts-ignore
import Client from '../database'
import User from '../database'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';

dotenv.config();

export type User = {
    id: number,
    fisrtName: string,
    lastName: string,
    password: string
}

export class UserStore {
    private static pepper = process.env.BCRYPT_PASSWORD;
    private static saltRounds = Number(process.env.SALT_ROUNDS);

    async create(u: User): Promise<User> {
        try {
          // @ts-ignore
          const conn = await Client.connect()
          const sql = 'INSERT INTO users (firstName, lastName, password) VALUES($1, $2, $3) RETURNING *'
    
          const hash = bcrypt.hashSync(
            u.password + UserStore.pepper, 
            UserStore.saltRounds
          );
    
          const result = await conn.query(sql, [u.fisrtName, u.lastName, hash])
          const user = result.rows[0]
    
          conn.release()
    
          return user
        } catch(err) {
          throw new Error(`unable create user (${u.fisrtName} ${u.lastName}): ${err}`)
        } 
    }

    async authenticate(fisrtName: string, lastName: string, password: string): Promise<User | null> {
        const conn = await Client.connect()
        const sql = 'SELECT password FROM users WHERE firstName=($1) and lastName=($2)'
    
        const result = await conn.query(sql, [fisrtName, lastName])
        
        if(result.rows.length) {
    
          const user = result.rows[0]
    
          console.log(user)
    
          if (bcrypt.compareSync(password+UserStore.pepper, user.password)) {
            return user
          }
        }
    
        return null
    }

      async index(): Promise<User[]> {
        try {
          // @ts-ignore
          const conn = await Client.connect()
          const sql = 'SELECT * FROM users'
    
          const result = await conn.query(sql)
    
          conn.release()
    
          return result.rows 
        } catch (err) {
          throw new Error(`Could not get users. Error: ${err}`)
        }
    }
    
      async show(id: string): Promise<User> {
        try {
        const sql = 'SELECT * FROM users WHERE id=($1)'
        // @ts-ignore
        const conn = await Client.connect()
    
        const result = await conn.query(sql, [id])
    
        conn.release()
    
        return result.rows[0]
        } catch (err) {
            throw new Error(`Could not find user ${id}. Error: ${err}`)
        }
    }
}

/*const create = async (req: Request, res: Response) => {
    const user: User = {
        username: req.body.username,
        password: req.body.password,
    }
    try {
        const newUser = await store.create(user)
        const token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET);
        res.json(token)
    } catch(err) {
        res.status(400)
        res.json(err + user)
    }
}

const authenticate = async (req: Request, res: Response) => {
    const user: User = {
      username: req.body.username,
      password: req.body.password,
    }
    try {
        const u = await store.authenticate(user.username, user.password)
        const token = jwt.sign({ user: u }, process.env.TOKEN_SECRET);
        res.json(token)
    } catch(error) {
        res.status(401)
        res.json({ error })
    }
  }

  const update = async (req: Request, res: Response) => {
    const user: User = {
        id: parseInt(req.params.id),
        username: req.body.username,
        password: req.body.password,
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
        res.json(updated)
    } catch(err) {
        res.status(400)
        res.json(err + user)
    }
}
    */