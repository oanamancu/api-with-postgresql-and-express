import dotenv from 'dotenv';
import { Pool } from 'pg';
import 'dotenv/config';

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_TEST_DB,
  ENV
} = process.env;

let Client: Pool = new Pool();
console.log('current env mode', ENV);

if (ENV === 'dev') {
  Client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD
  });
}

if (ENV?.trim() === 'test') {
  console.log('AICI!!!');
  Client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_TEST_DB,
    password: POSTGRES_PASSWORD,
    user: POSTGRES_USER
  });
}

export default Client;
