//@ts-expect-error any
import Client from '../database';

export type Product = {
  id?: number;
  name: string;
  category: string;
  price: number;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      //@ts-expect-error any
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    }
  }

  async show(id: string): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      //@ts-expect-error any
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`);
    }
  }

  async create(p: Product): Promise<Product> {
    try {
      const sql =
        'INSERT INTO products (name, category, price) VALUES($1, $2, $3) RETURNING *';
      //@ts-expect-error any
      const conn = await Client.connect();

      const result = await conn.query(sql, [p.name, p.category, p.price]);

      const product = result.rows[0];

      conn.release();

      return product;
    } catch (err) {
      throw new Error(`Could not add new product ${p.name}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
      //@ts-expect-error any
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      const product = result.rows[0];

      conn.release();

      return product;
    } catch (err) {
      throw new Error(`Could not delete product ${id}. Error: ${err}`);
    }
  }

  async productsByCategory(category: string): Promise<Product[]> {
    try {
      //@ts-expect-error any
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products where category = ($1)';

      const result = await conn.query(sql, [category]);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(
        `Could not get products for category ${category}. Error: ${err}`
      );
    }
  }

  async top5Products(): Promise<Product[]> {
    try {
      const sql = `select products.id, products.name from products inner join order_products on products.id = order_products.id group by products.id, products.name order by count(products.id) desc limit 5`;
      //@ts-expect-error any
      const conn = await Client.connect();
      const result = await conn.query(sql);
      return result.rows;
    } catch (err) {
      throw new Error(`can't get top 5 products: ${err}`);
    }
  }
}
