import { Wheat, TreePine, Carrot, Apple } from 'lucide-react';

export const farmListings = [
  { 
    id: 1,
    name: 'Green Valley Farm', 
    location: 'Nakuru, Kenya',
    size: '50 acres',
    crop: 'Maize & Beans',
    expectedReturn: '18%',
    minInvestment: '$5,000',
    duration: '6 months',
    farmer: 'John Kamau',
    icon: Wheat,
    color: 'bg-green-500',
    image: 'https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  { 
    id: 2,
    name: 'Sunrise Coffee Estate', 
    location: 'Kiambu, Kenya',
    size: '25 acres',
    crop: 'Coffee',
    expectedReturn: '22%',
    minInvestment: '$8,000',
    duration: '12 months',
    farmer: 'Mary Wanjiku',
    icon: TreePine,
    color: 'bg-amber-600',
    image: 'https://images.pexels.com/photos/4022092/pexels-photo-4022092.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  { 
    id: 3,
    name: 'Fresh Harvest Gardens', 
    location: 'Meru, Kenya',
    size: '15 acres',
    crop: 'Vegetables',
    expectedReturn: '15%',
    minInvestment: '$3,000',
    duration: '4 months',
    farmer: 'Peter Mwangi',
    icon: Carrot,
    color: 'bg-orange-500',
    image: 'https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  { 
    id: 4,
    name: 'Golden Fruit Orchards', 
    location: 'Machakos, Kenya',
    size: '30 acres',
    crop: 'Mangoes',
    expectedReturn: '20%',
    minInvestment: '$6,500',
    duration: '8 months',
    farmer: 'Grace Mutua',
    icon: Apple,
    color: 'bg-yellow-500',
    image: 'https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
];

export const myInvestments = [
  { name: 'Green Valley Farm', amount: '$12,000', returns: '+$2,160', status: 'Active' },
  { name: 'Coffee Estate', amount: '$8,000', returns: '+$1,760', status: 'Harvesting' },
  { name: 'Vegetable Farm', amount: '$5,000', returns: '+$750', status: 'Growing' },
];

export const investmentData = [
  { month: 'Jan', returns: 12000 },
  { month: 'Feb', returns: 18000 },
  { month: 'Mar', returns: 15000 },
  { month: 'Apr', returns: 22000 },
  { month: 'May', returns: 19000 },
  { month: 'Jun', returns: 25000 },
  { month: 'Jul', returns: 21000 },
  { month: 'Aug', returns: 28000 },
  { month: 'Sep', returns: 24000 },
  { month: 'Oct', returns: 31000 },
  { month: 'Nov', returns: 27000 },
  { month: 'Dec', returns: 33000 },
];

export const cropYieldData = [
  { crop: 'Maize', yield: 85, target: 100 },
  { crop: 'Beans', yield: 92, target: 100 },
  { crop: 'Coffee', yield: 78, target: 100 },
  { crop: 'Tomatoes', yield: 95, target: 100 },
];