import supertest from 'supertest';
import app from '../../server';
import { UserStore } from '../../models/user';

const request = supertest(app);
const userStore = new UserStore();

describe('Product Handler', () => {
  let token: string, productId: number;
  const userId: number = 2;

  beforeAll(async () => {
    const payload = {
      firstName: 'one',
      lastName: 'one',
      password: 'one'
    };
    token = (
      await request
        .post('/users')
        .send(payload)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
    ).body;
  });

  it('should add a product - create', async () => {
    const payload = {
      name: 'honey',
      category: 'sweet',
      price: 5
    };
    const response = await request
      .post('/products')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(201);
    productId = response.body.id;
  });

  it('should return a list of products - index', async () => {
    const response = await request.get('/products');
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('honey');
  });

  it('should return the correct product - show', async () => {
    const response = await request.get(`/products/${productId}`);
    expect(response.body.name).toBe('honey');
    expect(response.body.id).toBe(productId);
  });

  it('should return products with sweet category', async () => {
    const response = await request.get('/products/category/sweet');
    expect(response.body[0].category).toEqual('sweet');
  });

  it('should return empty array with drink category', async () => {
    const response = await request.get('/products/category/drink');
    expect(response.body.length).toBe(0);
  });

  it('delete method should remove the product', async () => {
    const response = await request
      .delete(`/products/${productId}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect((await request.get('/products')).body.length).toBe(0);
  });

  afterAll(async () => {
    await userStore.delete(String(userId));
  });
});
