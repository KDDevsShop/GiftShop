import mongoose from 'mongoose';

const ProductTypeSchema = new mongoose.Schema(
  {
    productTypeName: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productImagePath: [
      {
        type: String,
      },
    ],
    productType: {
      type: mongoose.Types.ObjectId,
      ref: 'ProductType',
    },
    countInStock: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountedPrice: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    avgStar: {
      type: Number,
      default: 0,
    },
    recommendedTypes: [
      {
        type: String,
        enum: [
          'ISTJ',
          'ISFJ',
          'INFJ',
          'INTJ',
          'ISTP',
          'ISFP',
          'INFP',
          'INTP',
          'ESTP',
          'ESFP',
          'ENFP',
          'ENTP',
          'ESTJ',
          'ESFJ',
          'ENFJ',
          'ENTJ',
        ],
      },
    ],
    keywords: [
      {
        type: String,
      },
    ],
    traits: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ProductType = mongoose.model('ProductType', ProductTypeSchema);
const Product = mongoose.model('Product', ProductSchema);

export { ProductType, Product };
