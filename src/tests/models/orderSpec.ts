import { OrderStore } from '../../models/order';
import { UserStore } from '../../models/user';
import { ProductStore } from '../../models/product';
import exp from 'constants';

const store = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore(); 

describe("Order Model", () => {
  
  beforeAll(
    async () => {
      await userStore.create({
        firstName : "one",
        lastName : "one",
        password: "one"
      })
      await productStore.create({
        "name": "honey",
        "category": "sweet",
        "price": 5
    });
  });

  it('should have a checkOpenOrder method', () => {
    expect(store.checkOpenOrder).toBeDefined();
  });

  it('should have an addProduct method', () => {
    expect(store.addProduct).toBeDefined();
  });

  it('should have a currentOrdersByUser method', () => {
    expect(store.currentOrdersByUser).toBeDefined();
  });

  it('should have a productsInOrder method', () => {
    expect(store.productsInOrder).toBeDefined();
  });

  it('should have a completedOrdersByUser method', () => {
    expect(store.completedOrdersByUser).toBeDefined();
  });

  it('should have a createNewOrderForUser method', () => {
    expect(store.createNewOrderForUser).toBeDefined();
  });

  it('should have a deleteProductFromOrder method', () => {
    expect(store.deleteProductFromOrder).toBeDefined();
  });

  it('should have a markOrderAsComplete method', () => {
    expect(store.markOrderAsComplete).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('create method should add create new order for user', async () => {
    const result = await store.createNewOrderForUser('1');
    expect(Object.values(result)).toEqual([1, 'active', '1']);
  });

  it('currentOrdersByUser method should return current active orders for user', async () => {
    const result = await store.currentOrdersByUser('1');
    expect(result.length).toBe(1);
    expect(Object.values(result[0])).toEqual([1, 'active', '1']);
  });

  it('checkOpenOrder return true if order is active', async () => {
    const result = await store.checkOpenOrder('1');
    expect(result).toBeTrue();
  });

  it('addProduct method should add a new product to order & return it', async () => {
    const result = await store.addProduct(4,'1','1');
    console.log(`Result: ${Object.entries(result)}`);
    expect(Object.values(result)).toEqual([1,4,'1','1']);
  });

  it('productsInOrder method should return products from order', async () => {
    const result = await store.productsInOrder('1');
    expect(result).toEqual([{
      id: 1,
      name: 'honey',
      quantity: 4
    }]);
  });

  it('markOrderAsComplete method should mark order as complete & return it', async () => {
    const result = await store.markOrderAsComplete('1');
    expect(Object.values(result)).toEqual([1, 'complete', '1']);
  });

  it('completedOrdersByUser method should return all completed orders for user', async () => {
    const result = await store.completedOrdersByUser('1');
    expect(Object.values(result[0])).toEqual([1, 'complete', '1']);
    expect(result.length).toBe(1);
  });

  it('addProduct method should not add product in complete order', async () => {
    await expectAsync(store.addProduct(4,'2','1')).toBeRejectedWithError();
  });

  it('checkOpenOrder return false if order is active', async () => {
    const result = await store.checkOpenOrder('1');
    expect(result).toBeFalse();
  });

  it('should return top 5 products', async() => {
    expect(await productStore.top5Products()).toBeTruthy();
  });

  it('delete method should remove the order', async () => {
    await store.deleteProductFromOrder('1', '1')
    expect(await store.productsInOrder('1')).toEqual(null);
  });

  it('delete method should remove the order', async () => {
    store.delete("1");
    const result = await store.currentOrdersByUser('1')
    expect(result).toEqual([]);
  });

  afterAll(
    async () => {
      await userStore.delete("1");
      await productStore.delete("1");
  });

});