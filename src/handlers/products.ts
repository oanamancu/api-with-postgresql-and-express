import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import { verifyAuthToken } from '../middleware/authorization';

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price
    };

    const newProduct = await store.create(product);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(req.params.id);
  res.status(200).json(deleted);
};

const productsByCategory = async (req: Request, res: Response) => {
  try {
    const products = await store.productsByCategory(req.params.category);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};

const topProducts = async (_req: Request, res: Response) => {
  try { 
    const products = await store.top5Products();
    res.status(200).json(products);
  } catch (err) { 
    res.status(500).json(err);
  }
};


const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyAuthToken, create);
  app.delete('/products/:id', verifyAuthToken, destroy);
  app.get('/products/category/:category', productsByCategory);
  app.get('/products_top', topProducts);
};

export default productRoutes;
