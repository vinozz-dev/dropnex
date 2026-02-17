import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// Enums
export const UserRole = ['customer', 'store_owner', 'delivery_partner', 'admin'] as const;
export const OrderStatus = ['placed', 'accepted', 'packed', 'picked_up', 'in_transit', 'delivered', 'cancelled'] as const;
export const PaymentMethod = ['card', 'upi', 'wallet', 'cod', 'net_banking'] as const;
export const PaymentStatus = ['pending', 'completed', 'failed', 'refunded'] as const;

// Interfaces
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: typeof UserRole[number];
  phone?: string;
  isVerified: boolean;
  isActive: boolean;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    lat: number;
    lng: number;
  };
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStore extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    lat: number;
    lng: number;
  };
  phone?: string;
  email?: string;
  isActive: boolean;
  isVerified: boolean;
  deliveryRadius: number;
  minOrderAmount: number;
  deliveryFee: number;
  rating: number;
  totalReviews: number;
  operatingHours?: Record<string, { open: string; close: string }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct extends Document {
  storeId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  category: string;
  price: number;
  unit: string;
  images: string[];
  isActive: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  deliveryPartnerId?: mongoose.Types.ObjectId;
  orderNumber: string;
  status: typeof OrderStatus[number];
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    unit: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    lat: number;
    lng: number;
  };
  deliveryInstructions?: string;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  paymentMethod: typeof PaymentMethod[number];
  paymentStatus: typeof PaymentStatus[number];
  paymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schemas
const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: UserRole, default: 'customer' },
  phone: { type: String, maxlength: 15 },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  firstName: String,
  lastName: String,
  avatar: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    lat: Number,
    lng: Number
  },
  stripeCustomerId: String,
  stripeSubscriptionId: String
}, { timestamps: true });

const storeSchema = new Schema<IStore>({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  phone: { type: String, maxlength: 15 },
  email: String,
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  deliveryRadius: { type: Number, default: 5 },
  minOrderAmount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  operatingHours: Schema.Types.Mixed
}, { timestamps: true });

const productSchema = new Schema<IProduct>({
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  name: { type: String, required: true },
  description: String,
  category: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, default: 'piece' },
  images: [String],
  isActive: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  tags: [String]
}, { timestamps: true });

const orderSchema = new Schema<IOrder>({
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  deliveryPartnerId: { type: Schema.Types.ObjectId, ref: 'User' },
  orderNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: OrderStatus, default: 'placed' },
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    unit: String
  }],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  deliveryInstructions: String,
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  paymentMethod: { type: String, enum: PaymentMethod, required: true },
  paymentStatus: { type: String, enum: PaymentStatus, default: 'pending' },
  paymentIntentId: String
}, { timestamps: true });

// Models
export const User = mongoose.model<IUser>('User', userSchema);
export const Store = mongoose.model<IStore>('Store', storeSchema);
export const Product = mongoose.model<IProduct>('Product', productSchema);
export const Order = mongoose.model<IOrder>('Order', orderSchema);

// Zod schemas for validation
export const insertUserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(UserRole).default('customer'),
  phone: z.string().max(15).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatar: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    lat: z.number(),
    lng: z.number()
  }).optional()
});

export const insertStoreSchema = z.object({
  ownerId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    lat: z.number(),
    lng: z.number()
  }),
  phone: z.string().max(15).optional(),
  email: z.string().email().optional(),
  deliveryRadius: z.number().default(5),
  minOrderAmount: z.number().default(0),
  deliveryFee: z.number().default(0)
});

export const insertProductSchema = z.object({
  storeId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: z.string(),
  price: z.number().positive(),
  unit: z.string().default('piece'),
  images: z.array(z.string()).default([]),
  stockQuantity: z.number().default(0),
  lowStockThreshold: z.number().default(10),
  tags: z.array(z.string()).default([])
});

export const insertOrderSchema = z.object({
  customerId: z.string(),
  storeId: z.string(),
  deliveryPartnerId: z.string().optional(),
  status: z.enum(OrderStatus).default('placed'),
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    unit: z.string()
  })),
  subtotal: z.number(),
  deliveryFee: z.number().default(0),
  total: z.number(),
  deliveryAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    lat: z.number(),
    lng: z.number()
  }),
  deliveryInstructions: z.string().optional(),
  paymentMethod: z.enum(PaymentMethod),
  paymentStatus: z.enum(PaymentStatus).default('pending'),
  paymentIntentId: z.string().optional()
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertStore = z.infer<typeof insertStoreSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;