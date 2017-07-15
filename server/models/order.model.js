import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const OrderBookSchema = new mongoose.Schema({
  orders: [OrderSchema]
});

const OrderSchema = new mongoose.Schema({
  base: { type: String, required: true }, // base currency
  counter: { type: String, required: true }, // counter currency
  amount: { type: Number, required: true },
  price: { type: Number, required: true }
});

const Order = mongoose.model('Order', OrderSchema);
const OrderBook = mongoose.model('OrderBook', OrderBookSchema);

export default { Order, OrderBook };
