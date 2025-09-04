import { Product } from "@/components/ui/product-card";
import solarPanel400W from "@/assets/solar-panel-400w.jpg";
import solarInverter5kW from "@/assets/solar-inverter-5kw.jpg";
import lithiumBattery100Ah from "@/assets/lithium-battery-100ah.jpg";
import mpptController from "@/assets/mppt-controller.jpg";

export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "SolarTech 400W Monocrystalline Solar Panel",
    description: "High-efficiency monocrystalline solar panel with 21% efficiency rating. Perfect for residential installations.",
    price: 85000,
    originalPrice: 95000,
    image: solarPanel400W,
    category: "Solar Panels",
    brand: "SolarTech",
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    stockCount: 15
  },
  {
    id: "2",
    name: "PowerMax 5kW Solar Inverter",
    description: "Grid-tie inverter with MPPT technology for maximum power extraction from your solar panels.",
    price: 450000,
    originalPrice: 500000,
    image: solarInverter5kW,
    category: "Inverters",
    brand: "PowerMax",
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    stockCount: 8
  },
  {
    id: "3",
    name: "EcoCharge Lithium Battery 100Ah",
    description: "Deep cycle lithium iron phosphate battery with 6000+ cycle life and built-in BMS.",
    price: 280000,
    image: lithiumBattery100Ah,
    category: "Batteries",
    brand: "EcoCharge",
    rating: 4.9,
    reviewCount: 156,
    inStock: true,
    stockCount: 12
  },
  {
    id: "4",
    name: "SunTracker MPPT Charge Controller 60A",
    description: "Advanced MPPT charge controller with LCD display and multiple protection features.",
    price: 65000,
    originalPrice: 75000,
    image: mpptController,
    category: "Charge Controllers",
    brand: "SunTracker",
    rating: 4.7,
    reviewCount: 78,
    inStock: true,
    stockCount: 25
  },
  {
    id: "5",
    name: "GreenGrid 300W Polycrystalline Panel",
    description: "Cost-effective polycrystalline solar panel ideal for large installations.",
    price: 65000,
    image: solarPanel400W,
    category: "Solar Panels",
    brand: "GreenGrid",
    rating: 4.4,
    reviewCount: 203,
    inStock: true,
    stockCount: 30
  },
  {
    id: "6",
    name: "HybridPro 8kW Inverter System",
    description: "Hybrid inverter with battery backup capability and smart grid management.",
    price: 850000,
    originalPrice: 950000,
    image: solarInverter5kW,
    category: "Inverters",
    brand: "HybridPro",
    rating: 4.8,
    reviewCount: 67,
    inStock: false,
    stockCount: 0
  },
  {
    id: "7",
    name: "PowerBank 200Ah AGM Battery",
    description: "Maintenance-free AGM battery designed for solar energy storage systems.",
    price: 120000,
    image: lithiumBattery100Ah,
    category: "Batteries",
    brand: "PowerBank",
    rating: 4.3,
    reviewCount: 145,
    inStock: true,
    stockCount: 20
  },
  {
    id: "8",
    name: "SmartCharge PWM Controller 30A",
    description: "Affordable PWM charge controller with digital display and overload protection.",
    price: 25000,
    image: "/placeholder.svg",
    category: "Charge Controllers",
    brand: "SmartCharge",
    rating: 4.1,
    reviewCount: 89,
    inStock: true,
    stockCount: 45
  },
  {
    id: "9",
    name: "FlexPanel 100W Portable Solar Panel",
    description: "Lightweight, flexible solar panel perfect for RVs, boats, and mobile applications.",
    price: 45000,
    originalPrice: 55000,
    image: "/placeholder.svg",
    category: "Solar Panels",
    brand: "FlexPanel",
    rating: 4.5,
    reviewCount: 92,
    inStock: true,
    stockCount: 18
  },
  {
    id: "10",
    name: "UltraPower 10kW Three-Phase Inverter",
    description: "Commercial-grade three-phase inverter for large-scale solar installations.",
    price: 1200000,
    image: "/placeholder.svg",
    category: "Inverters",
    brand: "UltraPower",
    rating: 4.9,
    reviewCount: 34,
    inStock: true,
    stockCount: 5
  },
  {
    id: "11",
    name: "EnergyVault 500Ah Lithium Battery Bank",
    description: "High-capacity lithium battery bank for commercial energy storage applications.",
    price: 1800000,
    originalPrice: 2000000,
    image: "/placeholder.svg",
    category: "Batteries",
    brand: "EnergyVault",
    rating: 4.8,
    reviewCount: 28,
    inStock: true,
    stockCount: 3
  },
  {
    id: "12",
    name: "ProCharge 80A MPPT Controller",
    description: "Professional-grade MPPT charge controller with remote monitoring capabilities.",
    price: 95000,
    image: "/placeholder.svg",
    category: "Charge Controllers",
    brand: "ProCharge",
    rating: 4.7,
    reviewCount: 56,
    inStock: true,
    stockCount: 10
  }
];

export const categories = Array.from(new Set(sampleProducts.map(p => p.category)));
export const brands = Array.from(new Set(sampleProducts.map(p => p.brand)));
export const priceRange: [number, number] = [
  Math.min(...sampleProducts.map(p => p.price)),
  Math.max(...sampleProducts.map(p => p.price))
];