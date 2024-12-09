import supertest from "supertest";
import app from "../../server";
import { UserStore } from '../../models/user';
import { ProductStore } from '../../models/product';
import { OrderStore } from '../../models/order';


const request = supertest(app);
const userStore = new UserStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();

describe("Order Handler", () => {

    let token:string, productId:number, orderId:number;
    const userId = 1;

    beforeAll(async () => {
        const userPayload = {
            "firstName" : "one",
            "lastName" : "one",
            "password": "one"
        };
        token = (await request.post('/users').send(userPayload)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')).body;

        const productPayload = {
            "name": "honey",
            "category": "sweet",
            "price": 5
        };
        productId = (await request.post('/products').send(productPayload)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)).body.id;
    });

    it('create should add create new order for user', async () => {
        const response = await request.post('/orders')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);
        expect(response.body.status).toEqual('active');
        orderId = response.body.id;
    });
    
    it('should return current active orders for user', async () => {
        const response = await request.get(`/orders/current/${userId}/users`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

        expect(response.body.length).toBe(1);
        expect(response.status).toBe(200);
        expect(response.body[0].status).toEqual('active');
        expect(response.body[0].user_id).toBe(String(userId));
    });
    
    it('should add a new product to order & return it', async () => {
        const payload = {
            "productId": productId,
            "quantity": 4
        };
        const response = await request.post(`/orders/${orderId}/products`).send(payload)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);
        expect(response.body.order_id).toBe(String(orderId));
        expect(response.body.product_id).toBe(String(productId));
        expect(response.body.quantity).toBe(4);
    });
    
    it('should return products from order', async () => {
        const response = await request.get(`/orders/${orderId}/products`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
    });

    
    it('should mark order as complete & return it', async () => {
        const response = await request.put(`/orders/complete/${orderId}`);
        expect(response.body.status).toEqual('complete');
    });
    
    it('should return all completed orders for user', async () => {
        const response = await request.get(`/orders/completed/${userId}/users`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

        expect(response.body.length).toBe(1);
        expect(response.status).toBe(200);
        expect(response.body[0].status).toEqual('complete');
        expect(response.body[0].user_id).toBe(String(userId));
    });
    
    it('addProduct method should not add product in complete order', async () => {
        const payload = {
            "productId": productId,
            "quantity": 4
        };
        const response = await request.post(`/orders/${orderId}/products`).send(payload)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
    });
    
    it('should return top 5 products', async() => {
        const response = await request.get(`/products_top`);
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });
    
    
    it('delete method should remove product from order', async () => {
        const response = await request.delete(`/orders/${orderId}/products/${productId}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const productsInOrder = await request.get(`/orders/${orderId}/products`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);
        expect(productsInOrder.body).toBe(null);
    }); 
      

    afterAll(
        async () => {
          await userStore.delete(String(userId));
          await productStore.delete(String(productId));
          await orderStore.delete(String(orderId));
    });

})