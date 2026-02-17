import { Store, Product, Order } from '@shared/schema';

export const dummyStores: Store[] = [
  {
    id: '1',
    ownerId: 'owner1',
    name: 'Fresh Mart',
    description: 'Your neighborhood grocery store',
    address: {
      street: '123 Main Street',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      lat: 28.6139,
      lng: 77.2090
    },
    phone: '+91 9876543210',
    email: 'freshmart@example.com',
    isActive: true,
    isVerified: true,
    deliveryRadius: 5,
    minOrderAmount: 100,
    deliveryFee: 30,
    rating: 4.5,
    totalReviews: 150,
    operatingHours: {
      monday: { open: '08:00', close: '22:00' },
      tuesday: { open: '08:00', close: '22:00' },
      wednesday: { open: '08:00', close: '22:00' },
      thursday: { open: '08:00', close: '22:00' },
      friday: { open: '08:00', close: '22:00' },
      saturday: { open: '08:00', close: '23:00' },
      sunday: { open: '09:00', close: '21:00' }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    ownerId: 'owner2',
    name: 'Quick Electronics',
    description: 'Latest gadgets and electronics',
    address: {
      street: '456 Tech Street',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110002',
      lat: 28.6200,
      lng: 77.2100
    },
    phone: '+91 9876543211',
    email: 'quickelectronics@example.com',
    isActive: true,
    isVerified: true,
    deliveryRadius: 8,
    minOrderAmount: 500,
    deliveryFee: 50,
    rating: 4.2,
    totalReviews: 89,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    ownerId: 'owner3',
    name: 'MediCare Pharmacy',
    description: 'Trusted pharmacy for all your medical needs',
    address: {
      street: '789 Health Avenue',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110003',
      lat: 28.6100,
      lng: 77.2050
    },
    phone: '+91 9876543212',
    email: 'medicare@example.com',
    isActive: true,
    isVerified: true,
    deliveryRadius: 10,
    minOrderAmount: 50,
    deliveryFee: 25,
    rating: 4.8,
    totalReviews: 200,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    ownerId: 'owner4',
    name: 'Spice Garden',
    description: 'Authentic Indian spices and herbs',
    address: {
      street: '321 Spice Street',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110004',
      lat: 28.6080,
      lng: 77.2030
    },
    phone: '+91 9876543213',
    email: 'spicegarden@example.com',
    isActive: true,
    isVerified: true,
    deliveryRadius: 6,
    minOrderAmount: 150,
    deliveryFee: 35,
    rating: 4.6,
    totalReviews: 120,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    ownerId: 'owner5',
    name: 'BookWorm Corner',
    description: 'Books, stationery and educational supplies',
    address: {
      street: '654 Knowledge Lane',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110005',
      lat: 28.6250,
      lng: 77.2150
    },
    phone: '+91 9876543214',
    email: 'bookworm@example.com',
    isActive: true,
    isVerified: true,
    deliveryRadius: 4,
    minOrderAmount: 200,
    deliveryFee: 40,
    rating: 4.3,
    totalReviews: 85,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    ownerId: 'owner6',
    name: 'Fitness Hub',
    description: 'Sports equipment and fitness supplements',
    address: {
      street: '987 Fitness Avenue',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110006',
      lat: 28.6300,
      lng: 77.2200
    },
    phone: '+91 9876543215',
    email: 'fitnesshub@example.com',
    isActive: true,
    isVerified: true,
    deliveryRadius: 7,
    minOrderAmount: 500,
    deliveryFee: 60,
    rating: 4.4,
    totalReviews: 95,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '7',
    ownerId: 'owner7',
    name: 'Pet Paradise',
    description: 'Pet food, toys and accessories',
    address: {
      street: '147 Pet Street',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110007',
      lat: 28.6050,
      lng: 77.1980
    },
    phone: '+91 9876543216',
    email: 'petparadise@example.com',
    isActive: true,
    isVerified: true,
    deliveryRadius: 5,
    minOrderAmount: 300,
    deliveryFee: 45,
    rating: 4.7,
    totalReviews: 110,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '8',
    ownerId: 'owner8',
    name: 'Home Essentials',
    description: 'Household items and cleaning supplies',
    address: {
      street: '258 Home Lane',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110008',
      lat: 28.6120,
      lng: 77.2070
    },
    phone: '+91 9876543217',
    email: 'homeessentials@example.com',
    isActive: true,
    isVerified: true,
    deliveryRadius: 6,
    minOrderAmount: 250,
    deliveryFee: 35,
    rating: 4.1,
    totalReviews: 75,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '9',
    ownerId: 'owner9',
    name: 'Fashion Forward',
    description: 'Trendy clothing and accessories',
    address: {
      street: '369 Fashion Street',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110009',
      lat: 28.6180,
      lng: 77.2120
    },
    phone: '+91 9876543218',
    email: 'fashionforward@example.com',
    isActive: true,
    isVerified: true,
    deliveryRadius: 8,
    minOrderAmount: 800,
    deliveryFee: 50,
    rating: 4.0,
    totalReviews: 60,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '10',
    ownerId: 'owner10',
    name: 'Organic Valley',
    description: 'Organic fruits, vegetables and dairy',
    address: {
      street: '741 Organic Road',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110010',
      lat: 28.6220,
      lng: 77.2180
    },
    phone: '+91 9876543219',
    email: 'organicvalley@example.com',
    isActive: true,
    isVerified: true,
    deliveryRadius: 10,
    minOrderAmount: 400,
    deliveryFee: 40,
    rating: 4.9,
    totalReviews: 180,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '11',
    ownerId: 'owner11',
    name: 'Coffee Corner',
    description: 'Premium coffee beans and brewing equipment',
    address: {
      street: '852 Coffee Lane',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110011',
      lat: 28.6160,
      lng: 77.2040
    },
    phone: '+91 9876543220',
    email: 'coffeecorner@example.com',
    isActive: true,
    isVerified: true,
    deliveryRadius: 5,
    minOrderAmount: 300,
    deliveryFee: 30,
    rating: 4.5,
    totalReviews: 140,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '12',
    ownerId: 'owner12',
    name: 'Baby Care Plus',
    description: 'Baby products, diapers and infant care',
    address: {
      street: '963 Baby Street',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110012',
      lat: 28.6090,
      lng: 77.2010
    },
    phone: '+91 9876543221',
    email: 'babycareplus@example.com',
    isActive: true,
    isVerified: true,
    deliveryRadius: 6,
    minOrderAmount: 200,
    deliveryFee: 25,
    rating: 4.8,
    totalReviews: 165,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '13',
    ownerId: 'owner13',
    name: 'Bakery Bliss',
    description: 'Fresh baked goods, cakes and pastries',
    address: {
      street: '159 Bakery Road',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110013',
      lat: 28.6270,
      lng: 77.2220
    },
    phone: '+91 9876543222',
    email: 'bakerybliss@example.com',
    isActive: true,
    isVerified: true,
    deliveryRadius: 4,
    minOrderAmount: 150,
    deliveryFee: 20,
    rating: 4.6,
    totalReviews: 200,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const dummyProducts: Record<string, Product[]> = {
  '1': [
    {
      id: 'p1',
      storeId: '1',
      name: 'Organic Bananas',
      description: 'Fresh organic bananas from local farms',
      category: 'Fruits',
      price: 85,
      unit: 'kg',
      images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop'],
      isActive: true,
      stockQuantity: 50,
      lowStockThreshold: 10,
      tags: ['organic', 'fresh', 'local'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'p2',
      storeId: '1',
      name: 'Whole Wheat Bread',
      description: 'Freshly baked whole wheat bread',
      category: 'Bakery',
      price: 45,
      unit: 'piece',
      images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop'],
      isActive: true,
      stockQuantity: 25,
      lowStockThreshold: 5,
      tags: ['fresh', 'bakery', 'healthy'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'p3',
      storeId: '1',
      name: 'Farm Fresh Milk',
      description: 'Pure cow milk from local dairy',
      category: 'Dairy',
      price: 60,
      unit: 'liter',
      images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop'],
      isActive: true,
      stockQuantity: 30,
      lowStockThreshold: 8,
      tags: ['fresh', 'dairy', 'pure'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'p4',
      storeId: '1',
      name: 'Basmati Rice',
      description: 'Premium quality basmati rice',
      category: 'Grains',
      price: 120,
      unit: 'kg',
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop'],
      isActive: true,
      stockQuantity: 100,
      lowStockThreshold: 20,
      tags: ['premium', 'basmati', 'grains'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  '2': [
    {
      id: 'p5',
      storeId: '2',
      name: 'Wireless Earbuds',
      description: 'High-quality wireless earbuds with noise cancellation',
      category: 'Electronics',
      price: 2999,
      unit: 'piece',
      images: ['https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop'],
      isActive: true,
      stockQuantity: 15,
      lowStockThreshold: 5,
      tags: ['wireless', 'audio', 'bluetooth'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'p6',
      storeId: '2',
      name: 'Smartphone Charger',
      description: 'Fast charging USB-C charger',
      category: 'Electronics',
      price: 899,
      unit: 'piece',
      images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop'],
      isActive: true,
      stockQuantity: 40,
      lowStockThreshold: 10,
      tags: ['charger', 'fast-charging', 'usb-c'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  '3': [
    {
      id: 'p7',
      storeId: '3',
      name: 'Paracetamol Tablets',
      description: 'Pain relief and fever reducer',
      category: 'Medicine',
      price: 25,
      unit: 'strip',
      images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop'],
      isActive: true,
      stockQuantity: 200,
      lowStockThreshold: 50,
      tags: ['medicine', 'pain-relief', 'fever'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'p8',
      storeId: '3',
      name: 'Hand Sanitizer',
      description: '70% alcohol-based hand sanitizer',
      category: 'Healthcare',
      price: 120,
      unit: 'bottle',
      images: ['https://images.unsplash.com/photo-1585435557343-3b092031d4c1?w=300&h=300&fit=crop'],
      isActive: true,
      stockQuantity: 80,
      lowStockThreshold: 20,
      tags: ['sanitizer', 'healthcare', 'alcohol-based'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  '4': [
    {
      id: 'p9',
      storeId: '4',
      name: 'Turmeric Powder',
      description: 'Pure turmeric powder',
      category: 'Spices',
      price: 80,
      unit: '100g',
      images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop'],
      isActive: true,
      stockQuantity: 150,
      lowStockThreshold: 30,
      tags: ['spices', 'turmeric', 'pure'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  '10': [
    {
      id: 'p10',
      storeId: '10',
      name: 'Organic Apples',
      description: 'Fresh organic apples',
      category: 'Fruits',
      price: 120,
      unit: 'kg',
      images: ['https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop'],
      isActive: true,
      stockQuantity: 80,
      lowStockThreshold: 15,
      tags: ['organic', 'apples', 'fresh'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  '13': [
    {
      id: 'p11',
      storeId: '13',
      name: 'Chocolate Cake',
      description: 'Rich chocolate cake',
      category: 'Bakery',
      price: 450,
      unit: 'piece',
      images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop'],
      isActive: true,
      stockQuantity: 20,
      lowStockThreshold: 5,
      tags: ['cake', 'chocolate', 'bakery'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
};

export const dummyOrders: Order[] = [
  {
    id: 'o1',
    customerId: 'customer1',
    storeId: '1',
    deliveryPartnerId: 'delivery1',
    orderNumber: 'DN1234567890',
    status: 'placed',
    items: [
      { productId: 'p1', name: 'Organic Bananas', price: 85, quantity: 2, unit: 'kg' },
      { productId: 'p2', name: 'Whole Wheat Bread', price: 45, quantity: 1, unit: 'piece' }
    ],
    subtotal: 215,
    deliveryFee: 30,
    total: 245,
    deliveryAddress: {
      street: '123 Customer Street',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      lat: 28.6150,
      lng: 77.2080
    },
    deliveryInstructions: 'Ring the doorbell twice',
    estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    paymentMethod: 'card',
    paymentStatus: 'completed',
    paymentIntentId: 'pi_test123',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'o2',
    customerId: 'customer2',
    storeId: '2',
    orderNumber: 'DN1234567891',
    status: 'accepted',
    items: [
      { productId: 'p5', name: 'Wireless Earbuds', price: 2999, quantity: 1, unit: 'piece' }
    ],
    subtotal: 2999,
    deliveryFee: 50,
    total: 3049,
    deliveryAddress: {
      street: '456 Tech Avenue',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110002',
      lat: 28.6180,
      lng: 77.2110
    },
    paymentMethod: 'upi',
    paymentStatus: 'completed',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date()
  },
  {
    id: 'o3',
    customerId: 'customer3',
    storeId: '3',
    orderNumber: 'DN1234567892',
    status: 'packed',
    items: [
      { productId: 'p7', name: 'Paracetamol Tablets', price: 25, quantity: 2, unit: 'strip' }
    ],
    subtotal: 50,
    deliveryFee: 25,
    total: 75,
    deliveryAddress: {
      street: '789 Health Street',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110003',
      lat: 28.6120,
      lng: 77.2060
    },
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    updatedAt: new Date()
  },
  {
    id: 'o4',
    customerId: 'customer4',
    storeId: '1',
    deliveryPartnerId: 'delivery2',
    orderNumber: 'DN1234567893',
    status: 'delivered',
    items: [
      { productId: 'p3', name: 'Farm Fresh Milk', price: 60, quantity: 3, unit: 'liter' },
      { productId: 'p4', name: 'Basmati Rice', price: 120, quantity: 1, unit: 'kg' }
    ],
    subtotal: 300,
    deliveryFee: 30,
    total: 330,
    deliveryAddress: {
      street: '456 Milk Lane',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110004',
      lat: 28.6200,
      lng: 77.2100
    },
    actualDeliveryTime: new Date(Date.now() - 10 * 60 * 1000),
    paymentMethod: 'upi',
    paymentStatus: 'completed',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    updatedAt: new Date()
  },
  {
    id: 'o5',
    customerId: 'customer5',
    storeId: '2',
    orderNumber: 'DN1234567894',
    status: 'cancelled',
    items: [
      { productId: 'p6', name: 'Smartphone Charger', price: 899, quantity: 1, unit: 'piece' }
    ],
    subtotal: 899,
    deliveryFee: 50,
    total: 949,
    deliveryAddress: {
      street: '321 Tech Avenue',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110005',
      lat: 28.6250,
      lng: 77.2150
    },
    paymentMethod: 'card',
    paymentStatus: 'refunded',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    updatedAt: new Date()
  }
];