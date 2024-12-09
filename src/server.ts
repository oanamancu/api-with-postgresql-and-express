import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './handlers/users';
import orderRoutes from './handlers/orders';
import productRoutes from './handlers/products';

const app: express.Application = express();
const address: string = '0.0.0.0:3000';

app.use(bodyParser.json());
userRoutes(app);
orderRoutes(app);
productRoutes(app);

app.get('/', function (_req: express.Request, res: express.Response) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
