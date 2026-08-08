import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@dealport.dev';
const ADMIN_PASSWORD = 'Admin@123';

const CATEGORY_NAMES = ['Electronic', 'Fashion', 'Home', 'Beauty', 'Sports'];

const CATEGORY_IMAGES: Record<string, string> = {
  Electronic: '/assets/images/electronic.png',
  Fashion: '/assets/images/fashion.png',
  Home: '/assets/images/home.png',
};

// Ordered so the last 4 entries (the ones matching the Dashboard.png reference) end up
// with the most recent createdAt timestamps and the highest totalOrders — that makes them
// the ones the real API naturally returns for the Top Products / Best Selling widgets,
// mirroring the reference screenshot while staying fully API-driven (no hardcoded data).
const PRODUCTS = [
  {
    name: 'Smart Fitness Tracker',
    description: 'Track steps, heart rate, and sleep with a 10-day battery life.',
    category: 'Electronic',
    price: 39.99,
    totalOrders: 30,
    stockQuantity: 60,
    stockStatus: 'IN_STOCK',
    status: 'DRAFT',
    tags: ['wearable', 'fitness'],
    colors: ['#111827'],
    image: '/assets/images/tracker.png',
  },
  {
    name: 'Leather Wallet',
    description: 'Slim bifold wallet with RFID-blocking lining.',
    category: 'Fashion',
    price: 29.99,
    totalOrders: 22,
    stockQuantity: 120,
    stockStatus: 'IN_STOCK',
    status: 'PUBLISHED',
    tags: ['wallet', 'accessories'],
    colors: ['#78350f', '#111827'],
    image: '/assets/images/wallet.png',
  },
  {
    name: 'Electric Hair Trimmer',
    description: 'Cordless precision trimmer with ceramic blades and USB-C charging.',
    category: 'Beauty',
    price: 34.99,
    totalOrders: 18,
    stockQuantity: 75,
    stockStatus: 'IN_STOCK',
    status: 'PUBLISHED',
    tags: ['grooming'],
    colors: ['#111827'],
    image: '/assets/images/trimmer.png',
  },
  {
    name: 'Ceramic Cookware Set',
    description: '10-piece non-stick ceramic cookware set, oven safe up to 450°F.',
    category: 'Home',
    price: 129.0,
    totalOrders: 12,
    stockQuantity: 20,
    stockStatus: 'IN_STOCK',
    status: 'DRAFT',
    tags: ['kitchen'],
    colors: ['#f3f4f6'],
  },
  {
    name: 'Yoga Mat Pro',
    description: 'Extra-thick non-slip yoga mat with carry strap.',
    category: 'Sports',
    price: 45.0,
    totalOrders: 35,
    stockQuantity: 90,
    stockStatus: 'IN_STOCK',
    status: 'PUBLISHED',
    tags: ['fitness', 'yoga'],
    colors: ['#a7f3d0', '#111827'],
  },
  {
    name: 'Wireless Earbuds Pro',
    description: 'Active noise cancelling earbuds with 30-hour total battery life.',
    category: 'Electronic',
    price: 89.99,
    discountPrice: 79.99,
    totalOrders: 40,
    stockQuantity: 150,
    stockStatus: 'IN_STOCK',
    status: 'PUBLISHED',
    tags: ['audio', 'wireless'],
    colors: ['#f3f4f6', '#111827'],
  },
  {
    name: 'Assorted Cross Bag',
    description: 'Compact genuine leather cross body bag with adjustable strap.',
    category: 'Fashion',
    price: 80.0,
    totalOrders: 506,
    stockQuantity: 60,
    stockStatus: 'IN_STOCK',
    status: 'PUBLISHED',
    tags: ['bag', 'accessories'],
    colors: ['#78350f'],
    image: '/assets/images/bag.png',
  },
  {
    name: 'T-shirt',
    description: 'Everyday soft cotton t-shirt, regular fit, machine washable.',
    category: 'Fashion',
    price: 35.4,
    totalOrders: 266,
    stockQuantity: 500,
    stockStatus: 'IN_STOCK',
    status: 'PUBLISHED',
    tags: ['apparel', 'basics'],
    colors: ['#f3f4f6', '#111827'],
    image: '/assets/images/tshirt.png',
  },
  {
    name: 'Nike Air Jordan',
    description: 'Iconic high-top sneaker with premium leather upper and classic colorway.',
    category: 'Fashion',
    price: 72.4,
    totalOrders: 56,
    stockQuantity: 0,
    stockStatus: 'OUT_OF_STOCK',
    status: 'PUBLISHED',
    tags: ['shoes', 'sneakers'],
    colors: ['#dc2626', '#111827'],
    image: '/assets/images/nikeShoe.png',
  },
  {
    name: 'Apple iPhone 13',
    description:
      'The iPhone 13 delivers cutting-edge performance with the A15 Bionic chip, an immersive Super Retina XDR display, advanced dual-camera system, and exceptional battery life.',
    category: 'Electronic',
    price: 999.0,
    discountPrice: 949.0,
    totalOrders: 104,
    stockQuantity: 42,
    stockStatus: 'IN_STOCK',
    status: 'PUBLISHED',
    featured: true,
    tags: ['smartphone', 'apple'],
    colors: ['#111827', '#e5e7eb'],
    image: '/assets/images/iphone.png',
  },
] as const;

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      passwordHash,
      name: 'DEALPORT Admin',
      role: 'admin',
    },
  });

  const categories = await Promise.all(
    CATEGORY_NAMES.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: { image: CATEGORY_IMAGES[name] },
        create: { name, image: CATEGORY_IMAGES[name] },
      }),
    ),
  );
  const categoryIdByName = new Map(categories.map((c) => [c.name, c.id]));

  await prisma.product.deleteMany({});

  for (const [index, p] of PRODUCTS.entries()) {
    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        discountPrice: 'discountPrice' in p ? p.discountPrice : undefined,
        taxIncluded: true,
        stockQuantity: p.stockQuantity,
        stockStatus: p.stockStatus,
        featured: 'featured' in p ? p.featured : false,
        totalOrders: p.totalOrders,
        images: ['image' in p ? p.image : `https://picsum.photos/seed/dealport-${index}/400/400`],
        tags: [...p.tags],
        colors: [...p.colors],
        status: p.status,
        category: { connect: { id: categoryIdByName.get(p.category) } },
      },
    });
  }

  console.log('Seed complete.');
  console.log(`Admin login -> email: ${ADMIN_EMAIL}  password: ${ADMIN_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
