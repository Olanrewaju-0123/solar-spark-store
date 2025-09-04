import { sequelize } from "./index.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { OrderItem } from "../models/OrderItem.js";

const sampleProducts = [
  {
    name: "Solar Panel 400W Monocrystalline",
    description:
      "High-efficiency 400W monocrystalline solar panel with 21.5% efficiency. Perfect for residential and commercial installations.",
    price: 299.99,
    stock: 50,
    category: "Solar Panels",
    imageUrl: "/assets/solar-panel-400w.jpg",
  },
  {
    name: "MPPT Solar Charge Controller 60A",
    description:
      "60A MPPT solar charge controller with LCD display, supporting 12V/24V/48V systems and up to 150V input.",
    price: 89.99,
    stock: 30,
    category: "Charge Controllers",
    imageUrl: "/assets/mppt-controller.jpg",
  },
  {
    name: "Solar Inverter 5kW Pure Sine Wave",
    description:
      "5000W pure sine wave solar inverter with grid-tie capability and smart monitoring system.",
    price: 899.99,
    stock: 20,
    category: "Inverters",
    imageUrl: "/assets/solar-inverter-5kw.jpg",
  },
  {
    name: "Lithium Battery 100Ah 12V",
    description:
      "100Ah 12V lithium iron phosphate battery with 4000+ cycles and built-in BMS protection.",
    price: 599.99,
    stock: 25,
    category: "Batteries",
    imageUrl: "/assets/lithium-battery-100ah.jpg",
  },
  {
    name: "Solar Panel Mounting Kit",
    description:
      "Complete roof mounting kit for solar panels including rails, clamps, and hardware for residential installations.",
    price: 149.99,
    stock: 40,
    category: "Mounting & Hardware",
    imageUrl: "/assets/mounting-kit.jpg",
  },
  {
    name: "Solar Cable 10AWG 100ft",
    description:
      "100ft of 10AWG solar cable with UV protection and weather-resistant insulation.",
    price: 79.99,
    stock: 60,
    category: "Cables & Connectors",
    imageUrl: "/assets/solar-cable.jpg",
  },
  {
    name: "Solar Water Pump 12V",
    description:
      "12V DC solar water pump with 3.5L/min flow rate, perfect for irrigation and water features.",
    price: 45.99,
    stock: 35,
    category: "Water Pumps",
    imageUrl: "/assets/water-pump.jpg",
  },
  {
    name: "Solar LED Street Light",
    description:
      "30W solar LED street light with motion sensor, 12-hour operation, and 5-year warranty.",
    price: 199.99,
    stock: 15,
    category: "Lighting",
    imageUrl: "/assets/street-light.jpg",
  },
];

export async function seedDatabase() {
  try {
    // Sync database
    await sequelize.sync({ force: true });
    console.log("Database synced successfully");

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
