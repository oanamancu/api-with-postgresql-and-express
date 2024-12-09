import Client from './../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export type User = {
  id?: number;
  firstName: string;
  lastName: string;
  password: string;
};

export class UserStore {
  private static pepper = process.env.BCRYPT_PASSWORD;
  private static saltRounds = Number(process.env.SALT_ROUNDS);

  async create(u: User) {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO users (firstName, lastName, password) VALUES($1, $2, $3) RETURNING *';

      const hash = bcrypt.hashSync(
        u.password + UserStore.pepper,
        UserStore.saltRounds
      );

      const result = await conn.query(sql, [u.firstName, u.lastName, hash]);
      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(
        `unable create user (${u.firstName} ${u.lastName}): ${err}`
      );
    }
  }

  async update(u: User) {
    try {
      const conn = await Client.connect();
      const sql =
        'update users set firstName = ($1), lastName = ($2), password = ($3) where id = ($4) RETURNING *';
      const hash = bcrypt.hashSync(
        u.password + UserStore.pepper,
        UserStore.saltRounds
      );

      const result = await conn.query(sql, [
        u.firstName,
        u.lastName,
        hash,
        u.id
      ]);
      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`unable to update user (${u.id}): ${err}`);
    }
  }

  async authenticate(id: number | undefined, password: string) {
    const conn = await Client.connect();
    const sql = 'SELECT * FROM users WHERE id=($1)';

    const result = await conn.query(sql, [id]);

    if (result.rows.length) {
      const user = result.rows[0];

      if (bcrypt.compareSync(password + UserStore.pepper, user.password)) {
        return user;
      }
    }

    return null;
  }

  async index() {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: string) {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }
}
