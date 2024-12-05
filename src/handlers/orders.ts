import express, { Request, Response } from 'express';
import { OrderStore } from '../models/order';
import { verifyAuthToken } from '../middleware/authorization';

const store = new OrderStore();

const addProductToOrder = async (_req: Request, res: Response) => {
  const orderId: string = _req.params.orderId;
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

const currentOrdersByUser = async (req: Request, res: Response) => {
  try {
    const orders = await store.currentOrdersByUser(req.params.userId);
    res.status(200).json(orders);
  } catch (err) {
    res.json(err);
  }
};

const productsInOrder = async (req: Request, res: Response) => {
  try {
    const products = await store.productsInOrder(req.params.orderId);
    res.status(200).json(products);
  } catch (err) {
    res.json(err);
  }
};

const completedOrdersByUser = async (req: Request, res: Response) => {
  try {
    const orders = await store.completedOrdersByUser(req.params.userId);
    res.status(200).json(orders);
  } catch (err) {
    res.json(err);
  }
};

const createNewOrderForUser = async (req: Request, res: Response) => {
  try {
    const order = await store.createNewOrderForUser(req.body.decoded.user.id);
    console.log(req.body.decoded.user.id);
    res.status(201).json(order);
  } catch (err) {
    res.json(err);
  }
};

const deleteProductFromOrder = async (req: Request, res: Response) => {
  try {
    const order = await store.deleteProductFromOrder(
      req.params.orderId,
      req.params.productId
    );
    res.status(200).json(order);
  } catch (err) {
    res.json(err);
  }
};

const markOrderAsComplete = async (req: Request, res: Response) => {
  try {
    const order = await store.markOrderAsComplete(req.params.id);
    res.status(200).json(order);
  } catch (err) {
    res.json(err);
  }
};

const orderRoutes = (app: express.Application) => {
  app.post('/orders/:orderId/products', verifyAuthToken, addProductToOrder); //
  app.get('/orders/current/:userId/users', verifyAuthToken, currentOrdersByUser); //
  app.get('/orders/completed/:userId/users',
    verifyAuthToken,
    completedOrdersByUser
  ); //
  app.get('/orders/:orderId/products', verifyAuthToken, productsInOrder); //
  app.post('/orders', verifyAuthToken, createNewOrderForUser); //
  app.delete(
    '/orders/:orderId/products/:productId',
    verifyAuthToken,
    deleteProductFromOrder
  ); //
  app.put('/orders/complete/:id',markOrderAsComplete); //
};

export default orderRoutes;
