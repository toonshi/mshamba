// src/mshamba_frontend/src/data/mockFarmData.js

export const farmListings = [
  {
    id: 1,
    name: 'Green Valley Farm',
    location: 'Nakuru, Kenya',
    crop: 'Maize & Beans',
    investmentRequired: 20000,
    currentInvestment: 12000,
    roi: 18,
    duration: '6 months',
    imageUrl: '/images/Tomatoes farming.png',
    description: 'A thriving farm specializing in organic maize and beans. Seeking investment for expansion.',
    farmer: 'John Kamau',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Sunrise Coffee Estate',
    location: 'Kiambu, Kenya',
    crop: 'Coffee',
    investmentRequired: 15000,
    currentInvestment: 8000,
    roi: 22,
    duration: '12 months',
    imageUrl: '/images/Kenyan Farmers.png',
    description: 'Premium coffee estate producing high-quality Arabica beans. Investment will fund new processing equipment.',
    farmer: 'Mary Wanjiku',
    status: 'Harvesting',
  },
  {
    id: 3,
    name: 'Fresh Harvest Gardens',
    location: 'Meru, Kenya',
    crop: 'Vegetables',
    investmentRequired: 10000,
    currentInvestment: 5000,
    roi: 15,
    duration: '4 months',
    imageUrl: '/images/Mshamba Logo.jpg',
    description: 'Sustainable vegetable gardens supplying fresh produce to local markets. Expanding to meet demand.',
    farmer: 'Peter Mwangi',
    status: 'Growing',
  },
];

export const myInvestments = [
  {
    id: 1,
    farmName: 'Green Valley Farm',
    location: 'Nakuru, Kenya',
    invested: 12000,
    currentValue: 14160,
    tokens: 1200,
    tokenSymbol: 'GVFT',
    roi: 18,
    status: 'Active',
    duration: '6 months',
    startDate: '2024-06-15',
    expectedHarvest: '2024-12-15',
    farmer: 'John Kamau',
    crop: 'Maize & Beans'
  },
  {
    id: 2,
    farmName: 'Sunrise Coffee Estate',
    location: 'Kiambu, Kenya',
    invested: 8000,
    currentValue: 9760,
    tokens: 800,
    tokenSymbol: 'SCET',
    roi: 22,
    status: 'Harvesting',
    duration: '12 months',
    startDate: '2024-01-10',
    expectedHarvest: '2025-01-10',
    farmer: 'Mary Wanjiku',
    crop: 'Coffee'
  },
  {
    id: 3,
    farmName: 'Fresh Harvest Gardens',
    location: 'Meru, Kenya',
    invested: 5000,
    currentValue: 5750,
    tokens: 500,
    tokenSymbol: 'FHGT',
    roi: 15,
    status: 'Growing',
    duration: '4 months',
    startDate: '2024-08-01',
    expectedHarvest: '2024-12-01',
    farmer: 'Peter Mwangi',
    crop: 'Vegetables'
  }
];

export const investmentData = [ // Renamed from performanceData
  { month: 'Jun', value: 25000 },
  { month: 'Jul', value: 26200 },
  { month: 'Aug', value: 27100 },
  { month: 'Sep', value: 28300 },
  { month: 'Oct', value: 29200 },
  { month: 'Nov', value: 29670 },
];

export const cropYieldData = [
  // Placeholder for crop yield data
  { month: 'Jan', yield: 100 },
  { month: 'Feb', yield: 120 },
  { month: 'Mar', yield: 150 },
  { month: 'Apr', yield: 130 },
  { month: 'May', yield: 160 },
  { month: 'Jun', yield: 180 },
];
