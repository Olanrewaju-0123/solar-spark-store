import { sequelize } from "./index.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { OrderItem } from "../models/OrderItem.js";
import { User } from "../models/User.js";
import { DiscountCode } from "../models/DiscountCode.js";
import bcrypt from "bcrypt";

const sampleProducts = [
  {
    name: "Solar Panel 400W Monocrystalline",
    description:
      "High-efficiency 400W monocrystalline solar panel with 21.5% efficiency. Perfect for residential and commercial installations.",
    price: 299.99,
    stock: 50,
    category: "Solar Panels",
    imageUrl: "https://solar-spark-store.vercel.app/solar-panel-400w.jpg",
  },
  {
    name: "MPPT Solar Charge Controller 60A",
    description:
      "60A MPPT solar charge controller with LCD display, supporting 12V/24V/48V systems and up to 150V input.",
    price: 89.99,
    stock: 30,
    category: "Charge Controllers",
    imageUrl: "https://solar-spark-store.vercel.app/mppt-controller.jpg",
  },
  {
    name: "Solar Inverter 5kW Pure Sine Wave",
    description:
      "5000W pure sine wave solar inverter with grid-tie capability and smart monitoring system.",
    price: 899.99,
    stock: 20,
    category: "Inverters",
    imageUrl: "https://solar-spark-store.vercel.app/solar-inverter-5kw.jpg",
  },
  {
    name: "Lithium Battery 100Ah 12V",
    description:
      "100Ah 12V lithium iron phosphate battery with 4000+ cycles and built-in BMS protection.",
    price: 599.99,
    stock: 25,
    category: "Batteries",
    imageUrl: "https://solar-spark-store.vercel.app/lithium-battery-100ah.jpg",
  },
  {
    name: "Solar Panel Mounting Kit",
    description:
      "Complete roof mounting kit for solar panels including rails, clamps, and hardware for residential installations.",
    price: 149.99,
    stock: 40,
    category: "Mounting & Hardware",
    imageUrl: "https://solar-spark-store.vercel.app/solar-panel-400w.jpg",
  },
  {
    name: "Solar Cable 10AWG 100ft",
    description:
      "100ft of 10AWG solar cable with UV protection and weather-resistant insulation.",
    price: 79.99,
    stock: 60,
    category: "Cables & Connectors",
    imageUrl: "https://solar-spark-store.vercel.app/mppt-controller.jpg",
  },
  {
    name: "Solar Water Pump 12V",
    description:
      "12V DC solar water pump with 3.5L/min flow rate, perfect for irrigation and water features.",
    price: 45.99,
    stock: 35,
    category: "Water Pumps",
    imageUrl: "https://solar-spark-store.vercel.app/lithium-battery-100ah.jpg",
  },
  {
    name: "Solar LED Street Light",
    description:
      "30W solar LED street light with motion sensor, 12-hour operation, and 5-year warranty.",
    price: 199.99,
    stock: 15,
    category: "Lighting",
    imageUrl: "https://solar-spark-store.vercel.app/solar-inverter-5kw.jpg",
  },
];

export async function seedDatabase() {
  try {
    // Sync database
    await sequelize.sync({ force: true });
    console.log("Database synced successfully");

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    const adminUser = await User.create({
      email: "admin@solarspark.com",
      password: adminPassword,
      role: "admin",
    });
    console.log("Admin user created:", adminUser.email);

    // Create sample customer
    const customerPassword = await bcrypt.hash("customer123", 10);
    const customerUser = await User.create({
      email: "customer@example.com",
      password: customerPassword,
      role: "customer",
    });
    console.log("Sample customer created:", customerUser.email);

    // Seed products
    const createdProducts = await Product.bulkCreate(sampleProducts);
    console.log(`Created ${createdProducts.length} products`);

    // Create a sample order
    const sampleOrder = await Order.create({
      customerName: "Sample Customer",
      customerEmail: "sample@example.com",
      shippingAddress: {
        street: "123 Sample St",
        city: "Sample City",
        state: "Sample State",
        zipCode: "12345",
        country: "Sample Country",
      },
      subtotal: 274.99,
      tax: 20.62,
      shipping: 25.0,
      total: 299.99,
      status: "pending",
      paymentMethod: "credit_card",
    });

    // Create order item
    if (createdProducts[0]) {
      await OrderItem.create({
        orderId: sampleOrder.id,
        productId: createdProducts[0].id,
        quantity: 1,
        unitPrice: createdProducts[0].price,
      });
    }

    console.log("Sample order created successfully");

    // Create sample discount codes
    const sampleDiscountCodes = [
      {
        code: "WELCOME10",
        description: "Welcome discount - 10% off your first order",
        type: "percentage" as const,
        value: 10,
        minOrderAmount: 100,
        maxDiscountAmount: 50,
        usageLimit: 100,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      {
        code: "SAVE50",
        description: "Save $50 on orders over $500",
        type: "fixed" as const,
        value: 50,
        minOrderAmount: 500,
        usageLimit: 50,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      },
      {
        code: "SOLAR20",
        description: "20% off solar panels",
        type: "percentage" as const,
        value: 20,
        maxDiscountAmount: 200,
        usageLimit: 25,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      },
    ];

    const createdDiscountCodes = await DiscountCode.bulkCreate(sampleDiscountCodes.map(code => ({
      ...code,
      isActive: true,
      usedCount: 0,
    })));
    console.log(`Created ${createdDiscountCodes.length} discount codes`);

    console.log("Database seeding completed!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

export async function clearDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log("Database cleared successfully");
  } catch (error) {
    console.error("Error clearing database:", error);
    throw error;
  }
}

// Run seeder if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("Seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}
