import express, { Request, Response } from 'express';
import { OrderStore } from '../models/order';

const store = new OrderStore();

const addProductToOrder = async (_req: Request, res: Response) => {
  const orderId: string = _req.params.id;
  const productId: string = _req.body.productId;
  const quantity: number = parseInt(_req.body.quantity);

  try {
    const addedProduct = await store.addProduct(quantity, orderId, productId);
    res.status(201).json(addedProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const currentOrderByUser = async (req: Request, res: Response) => {
  try {
    const order = store.currentOrderByUser(req.params.userId);
    res.status(200).json(order);
  } catch (err) {
    res.json(err);
  }
};

const productsInOrder = async (req: Request, res: Response) => {
  try {
    const products = store.productsInOrder(req.params.orderId);
    res.status(200).json(products);
  } catch (err) {
    res.json(err);
  }
};

const completedOrdersByUser = async (req: Request, res: Response) => {
  try {
    const orders = store.completedOrdersByUser(req.params.userId);
    res.status(200).json(orders);
  } catch (err) {
    res.json(err);
  }
};

const createNewOrderForUser = async (req: Request, res: Response) => {
  try {
    const order = store.createNewOrderForUser(req.params.userId);
    res.status(201).json(order);
  } catch (err) {
    res.json(err);
  }
};

const addProductToUser = async (req: Request, res: Response) => {
  try {
    store.addProductToUser(
      req.params.userId,
      parseInt(req.body.quantity),
      req.body.productId
    );
    res.status(201).json('success');
  } catch (err) {
    res.json(err);
  }
};

const deleteProductFromOrder = async (req: Request, res: Response) => {
  try {
    const order = store.deleteProductFromOrder(
      req.params.orderId,
      req.params.productId
    );
    res.status(200).json(order);
  } catch (err) {
    res.json(err);
  }
};

const orderRoutes = (app: express.Application) => {
  app.post('/orders/:orderId/products', addProductToOrder);
  app.get('/orders/current/:userId/users', currentOrderByUser);
  app.get('/orders/completed/:userId/users', completedOrdersByUser);
  app.get('/orders/:orderId/products', productsInOrder);
  app.post('/orders', createNewOrderForUser);
  app.post('/orders/:userId/users', addProductToUser);
  app.delete('/orders/:orderId/products', deleteProductFromOrder);
};

export default orderRoutes;
