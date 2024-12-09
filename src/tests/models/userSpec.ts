import { UserStore } from '../../models/user';

const store = new UserStore()

describe("User Model", () => {
  const userId = 5;

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

  it('should have an update method', () => {
    expect(store.update).toBeDefined();
  });

  it('should have an authenticate method', () => {
    expect(store.authenticate).toBeDefined();
  });

  it('create method should add a user', async () => {
    const result = await store.create({
        firstName : "one",
        lastName : "one",
        password: "one"
    }); 
    expect(result['firstname']).toEqual('one');
    expect(result['lastname']).toEqual('one');
  });

  it('index method should return a list of users', async () => {
    const result = await store.index();
    expect(result.length).toBe(1);
    expect(result[0]['firstname']).toEqual('one');
    expect(result[0]['lastname']).toEqual('one');
  });

  it('show method should return the correct user', async () => {
    const result = await store.show(String(userId));
    expect(result['firstname']).toEqual('one');
    expect(result['lastname']).toEqual('one');
  });

  it('authenticate method should return user if successful', async () => {
    const result = await store.authenticate(userId, "one");
    expect(result['firstname']).toEqual('one');
    expect(result['lastname']).toEqual('one');
    expect(result.id).toBe(userId);
  });

  it('update method should return updated user', async () => {
    const result = await store.update({
        firstName : "two",
        lastName : "two",
        password: "two",
        id: userId
  }); 
    expect(result['firstname']).toEqual('two');
    expect(result['lastname']).toEqual('two');
    expect(result.id).toBe(userId);
  });

  it('delete method should remove the user', async () => {
    await store.delete(String(userId));
    const result = await store.index()

    expect(result).toEqual([]);
  });

});