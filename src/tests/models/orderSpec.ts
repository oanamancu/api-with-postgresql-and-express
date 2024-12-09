import { OrderStore } from '../../models/order';
import { UserStore } from '../../models/user';
import { ProductStore } from '../../models/product';

const store = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe('Order Model', () => {
  const userId = 4;
  let productId: number, orderId: number;

  beforeAll(async () => {
    await userStore.create({
      firstName: 'one',
      lastName: 'one',
      password: 'one'
    });
    productId = (
      await productStore.create({
        name: 'honey',
        category: 'sweet',
        price: 5
      })
    ).id as number;
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
    const result = await store.createNewOrderForUser(String(userId));
    orderId = result.id as number;
    expect(Object.values(result)).toEqual([orderId, 'active', String(userId)]);
  });

  it('currentOrdersByUser method should return current active orders for user', async () => {
    const result = await store.currentOrdersByUser(String(userId));
    expect(result.length).toBe(1);
    expect(Object.values(result[0])).toEqual([
      orderId,
      'active',
      String(userId)
    ]);
  });

  it('checkOpenOrder return true if order is active', async () => {
    const result = await store.checkOpenOrder(String(orderId));
    expect(result).toBeTrue();
  });

  it('addProduct method should add a new product to order & return it', async () => {
    const result = await store.addProduct(
      4,
      String(orderId),
      String(productId)
    );
    expect(Object.values(result)).toEqual([
      2,
      4,
      String(orderId),
      String(productId)
    ]);
  });

  it('productsInOrder method should return products from order', async () => {
    const result = await store.productsInOrder(String(orderId));
    expect(result).toEqual([
      {
        id: productId,
        name: 'honey',
        quantity: 4
      }
    ]);
  });

  it('markOrderAsComplete method should mark order as complete & return it', async () => {
    const result = await store.markOrderAsComplete(String(orderId));
    expect(Object.values(result)).toEqual([
      orderId,
      'complete',
      String(userId)
    ]);
  });

  it('completedOrdersByUser method should return all completed orders for user', async () => {
    const result = await store.completedOrdersByUser(String(userId));
    expect(Object.values(result[0])).toEqual([
      orderId,
      'complete',
      String(userId)
    ]);
    expect(result.length).toBe(1);
  });

  it('addProduct method should not add product in complete order', async () => {
    await expectAsync(
      store.addProduct(4, String(orderId), String(productId))
    ).toBeRejectedWithError();
  });

  it('checkOpenOrder return false if order is active', async () => {
    const result = await store.checkOpenOrder(String(orderId));
    expect(result).toBeFalse();
  });

  it('should return top 5 products', async () => {
    expect(await productStore.top5Products()).toBeTruthy();
  });

  it('delete method should remove product from order', async () => {
    await store.deleteProductFromOrder(String(orderId), String(productId));
    expect(await store.productsInOrder(String(orderId))).toEqual(null);
  });

  it('delete method should remove the order', async () => {
    store.delete(String(orderId));
    const result = await store.currentOrdersByUser(String(userId));
    expect(result).toEqual([]);
  });

  afterAll(async () => {
    await userStore.delete(String(userId));
    await productStore.delete(String(productId));
  });
});
