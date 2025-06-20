import express from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';

import { connectDb } from './configs/dbConnection.js';

import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import productTypeRoute from './routes/productType.route.js';
import productRoute from './routes/product.route.js';
import addressRoute from './routes/address.route.js';
import cartRoute from './routes/cart.route.js';
import orderStatusRoute from './routes/orderStatus.route.js';
import orderRoute from './routes/order.route.js';
import statRoute from './routes/statistic.route.js';

dotenv.config({ path: `${process.cwd()}/.env` });

connectDb();

const app = express();
const port = process.env.PORT || 5000;
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(logger('dev'));

app.use('/uploads', express.static(path.join(path.dirname(''), 'uploads')));

app.use(`/api/auth`, authRoute);
app.use(`/api/users`, userRoute);
app.use(`/api/product-types`, productTypeRoute);
app.use(`/api/products`, productRoute);
app.use(`/api/address`, addressRoute);
app.use(`/api/cart`, cartRoute);
app.use(`/api/order-status`, orderStatusRoute);
app.use(`/api/order`, orderRoute);
app.use(`/api/stat`, statRoute);

app.use('*', (_, res) => {
  res.status(404).json({
    error: 'Oops... Can not found this route!!!',
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
