import mongoose from 'mongoose';

const orderStatusSchema = new mongoose.Schema({
  orderStatus: {
    type: String,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderDate: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    shippingAddress: {
      type: mongoose.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    orderDetail: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'CartDetail',
      },
    ],
    orderStatus: {
      type: mongoose.Types.ObjectId,
      ref: 'OrderStatus',
      default: '6824b9434a7c56ff9a4d24b4',
    },
    deliveryMethod: {
      type: String,
      enum: ['Standard', 'Express'],
      default: 'Standard',
    },
    paymentMethod: {
      type: String,
      enum: ['COD'],
      default: 'COD',
    },
    deliveredDate: {
      type: Date,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const OrderStatus = mongoose.model('OrderStatus', orderStatusSchema);
const Order = mongoose.model('Order', orderSchema);

export { OrderStatus, Order };
