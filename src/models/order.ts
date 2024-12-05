//@ts-expect-error any
import Client from '../database';

export type Order = {
  id?: number;
  status: string;
  userId: number;
};

export class OrderStore {
  async checkOpenOrder(orderId: string): Promise<boolean> {
    // get order to see if it is open
    try {
      const ordersql = 'SELECT * FROM orders WHERE id=($1)';

      //@ts-expect-error any
      const conn = await Client.connect();

      const result = await conn.query(ordersql, [orderId]);

      const order = result.rows[0];

      conn.release();

      if (order.status !== 'active') {
        return false;
      }

      return true;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  //method to attach a product to an order
  async addProduct(
    quantity: number,
    orderId: string,
    productId: string
  ): Promise<Order> {
    try {
      await this.checkOpenOrder(orderId);

      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
      //@ts-expect-error any
      const conn = await Client.connect();

      const result = await conn.query(sql, [quantity, orderId, productId]);

      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(
        `Could not add product ${productId} to order ${orderId}: ${err}`
      );
    }
  }

  async currentOrdersByUser(userId: string): Promise<Order[]> {
    try {
      //@ts-expect-error any
      const conn = await Client.connect();
      const sql = `select * from orders where user_id = ($1) and status='active'`;
      const result = await conn.query(sql, [userId]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async productsInOrder(orderId: string) {
    try {
      //@ts-expect-error any
      const conn = await Client.connect();
      const sql = ` select name, quantity from products inner join order_products on products.id = order_products.product_id where order_id = ($1)`;
      const result = await conn.query(sql, [orderId]);
      conn.release();
      if (result.rowCount > 0) {
        return result.rows;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async completedOrdersByUser(userId: string): Promise<Order[]> {
    try {
      //@ts-expect-error any
      const conn = await Client.connect();
      const sql = `select * from orders where user_id = ($1) and status='complete'`;
      const result = await conn.query(sql, [userId]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async createNewOrderForUser(userId: string): Promise<Order> {
    try {
      const sql =
        'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
      //@ts-expect-error any
      const conn = await Client.connect();
      const result = await conn.query(sql, ['active', userId]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not create new order: ${err}`);
    }
  }

  async deleteProductFromOrder(orderId: string, productId: string) {
    try {
      const sql =
        'DELETE FROM order_products where order_id = ($1) and product_id = ($2) RETURNING *';
      //@ts-expect-error any
      const conn = await Client.connect();
      const result = await conn.query(sql, [orderId, productId]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not delete product: ${err}`);
    }
  }

  async markOrderAsComplete(orderId: string) {
    try {
      const sql =
        `UPDATE orders set status = 'complete' where id = ($1) RETURNING *`;
      //@ts-expect-error any
      const conn = await Client.connect();
      const result = await conn.query(sql, [orderId]);
      const order = result.rows[0]; console.log(result.rowCount);
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not update order: ${err}`);
    }
  }
}
