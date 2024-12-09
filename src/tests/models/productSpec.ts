import exp from 'constants';
import { ProductStore } from '../../models/product';

const store = new ProductStore()

describe("Product Model", () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('should have a productsByCategory method', () => {
    expect(store.productsByCategory).toBeDefined();
  });

  it('should have a top5Products method', () => {
    expect(store.top5Products).toBeDefined();
  });

  it('create method should add a product', async () => {
    const result = await store.create({
      "name": "honey",
      "category": "sweet",
      "price": 5
  });
    expect(result).toEqual({
      id: 2,
      name: 'honey',
      category: 'sweet',
      price: 5
    });
  });

  it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(Object.values(result[0])).toEqual([2, 'honey', 5, 'sweet']);
    expect(result.length).toEqual(1);
  });

  it('show method should return the correct product', async () => {
    const result = await store.show("2");
    expect(result).toEqual({
      id: 2,
      name: 'honey',
      category: 'sweet',
      price: 5
    });
  });

  it('productsByCategory method should return products with sweet category', async () => {
    const result = await store.productsByCategory("sweet");
    expect(result).toEqual([{
      id: 2,
      name: 'honey',
      category: 'sweet',
      price: 5
    }]);
  });

  it('productsByCategory method should return empty array with drink category', async () => {
    const result = await store.productsByCategory("drink");
    expect(result).toEqual([]);
  });

  it('delete method should remove the product', async () => {
    await store.delete("2");
    expect((await store.index()).length).toEqual(0);
  });

});