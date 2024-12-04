//@ts-ignore
import Client from "../database";

export type Order = {
    id?: number,
    status: string,
    userId: number
}

export class OrderStore {

    async checkOpenOrder(orderId : string) : Promise<boolean> {

         // get order to see if it is open
    try {
        const ordersql = 'SELECT * FROM orders WHERE id=($1)'
        //@ts-ignore
        const conn = await Client.connect()
  
        const result = await conn.query(ordersql, [orderId])
  
        const order = result.rows[0]

        conn.release()
  
        if (order.status !== "active") {
          return false;
        }

        return true;
  
      } catch (err) {
        throw new Error(`${err}`)
      }
    }

    //method to attach a product to an order
    async addProduct(quantity: number, orderId: string, productId: string): Promise<Order> {

        try {

          await this.checkOpenOrder(orderId);

          const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'
          //@ts-ignore
          const conn = await Client.connect()
    
          const result = await conn
              .query(sql, [quantity, orderId, productId])
    
          const order = result.rows[0]
    
          conn.release()
    
          return order
        } catch (err) {
          throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`)
        }
      }

      async currentOrderByUser(userId: string) : Promise<Order | null> {
        try {
            //@ts-ignore
            const conn = await Client.connect();
            const sql = `select * from orders where user_id = ($1) and status='active'`;
            const result = await conn.query(sql, [userId]);
            conn.release();
            if (result.rowCount > 0 ) {
                return result.rows[0];
            }
            else {
               return null;
            }
        } catch(err) {
            throw(new Error(`${err}`));
        }
    }

    async productsInOrder(orderId: string) {
      try {
          //@ts-ignore
          const conn = await Client.connect();
          const sql = `select name, quantity from orders inner join order_products where orders.id = order_products.id and order_id = ($1)`;
          const result = await conn.query(sql, [orderId]);
          conn.release();
          if (result.rowCount > 0 ) {
              return result;
          }
          else {
             return null;
          }
      } catch(err) {
          throw(new Error(`${err}`));
      }
  }

    async completedOrdersByUser(userId: string) : Promise<Order[]> {
        try {
            //@ts-ignore
            const conn = await Client.connect();
            const sql = `select * from orders where user_id = ($1) and status='complete'`;
            const result = await conn.query(sql, [userId]);
            conn.release();
            return result.rows;
        } catch(err) {
            throw(new Error(`${err}`));
        }
    }

    async createNewOrderForUser(userId:string): Promise<Order> {
        try {  
            const sql = 'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *'
            //@ts-ignore
            const conn = await Client.connect()
            const result = await conn.query(sql, ['active', userId])
            const order = result.rows[0]
            conn.release()
            return order
          } catch (err) {
            throw new Error(`Could create new order: ${err}`)
          }
    }

    //method to attach a product to a new or old active user's order
    async addProductToUser(userId:string, quantity:number, productId:string): Promise<void> {
        try {
            let order = await this.currentOrderByUser(userId);
            order === null ? order = await this.createNewOrderForUser(userId) : '';
            await this.addProduct(quantity, String(order.id), productId);
        } catch (err) {
            throw new Error(`Could not add product for user ${userId}: ${err}`)
        }
    }

    async deleteProductFromOrder(orderId:string, productId:string) {
      try {  
        const sql = 'DELETE FROM order_products where order_id = ($1) and product_id = ($2) RETURNING *'
        //@ts-ignore
        const conn = await Client.connect()
        const result = await conn.query(sql, [orderId, productId])
        const order = result.rows[0]
        conn.release()
        return order
      } catch (err) {
        throw new Error(`Could not delete product: ${err}`)
      }
    }
}