import { UserStore } from '../../models/user';

const store = new UserStore()

describe("User Model", () => {
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
    expect(result[0]['id']).toBe(2);
  });

  it('show method should return the correct user', async () => {
    const result = await store.show("2");
    expect(result['firstname']).toEqual('one');
    expect(result['lastname']).toEqual('one');
  });

  it('authenticate method should return user if successful', async () => {
    const result = await store.authenticate(2, "one");
    expect(result['firstname']).toEqual('one');
    expect(result['lastname']).toEqual('one');
    expect(result.id).toBe(2);
  });

  it('update method should return updated user', async () => {
    const result = await store.update({
        firstName : "two",
        lastName : "two",
        password: "two",
        id: 2
  }); 
    expect(result['firstname']).toEqual('two');
    expect(result['lastname']).toEqual('two');
    expect(result.id).toBe(2);
  });

  it('delete method should remove the user', async () => {
    await store.delete("2");
    const result = await store.index()

    expect(result).toEqual([]);
  });

});