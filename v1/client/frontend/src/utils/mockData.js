
export const MOCK_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc', price: 182.50, change: 2.5, logo: '🍎' },
  { symbol: 'MSFT', name: 'Microsoft', price: 335.20, change: -1.2, logo: '💻' },
  { symbol: 'GOOGL', name: 'Alphabet', price: 140.80, change: 3.1, logo: '🔍' },
  { symbol: 'AMZN', name: 'Amazon', price: 151.94, change: 1.8, logo: '📦' },
  { symbol: 'TSLA', name: 'Tesla', price: 238.45, change: -4.5, logo: '⚡' },
  { symbol: 'NVDA', name: 'NVIDIA', price: 495.22, change: 5.2, logo: '🎮' },
  { symbol: 'META', name: 'Meta', price: 352.89, change: 2.1, logo: '👤' },
  { symbol: 'NFLX', name: 'Netflix', price: 478.33, change: -0.8, logo: '🎬' },
  { symbol: 'DIS', name: 'Disney', price: 92.15, change: 1.5, logo: '🎭' },
  { symbol: 'PYPL', name: 'PayPal', price: 62.89, change: -2.3, logo: '💳' }
];

export const MOCK_BUNDLES = [
  { 
    id: 1, 
    name: 'Tech Giants', 
    stocks: ['AAPL', 'MSFT', 'GOOGL', 'META'], 
    cost: 1011.39, 
    isPlatform: true, 
    performance: 12.5,
    description: 'Top performing tech companies'
  },
  { 
    id: 2, 
    name: 'Green Energy', 
    stocks: ['TSLA', 'ENPH', 'SEDG'], 
    cost: 425.30, 
    isPlatform: true, 
    performance: -3.2,
    description: 'Sustainable energy leaders'
  },
  { 
    id: 3, 
    name: 'Entertainment', 
    stocks: ['NFLX', 'DIS'], 
    cost: 570.48, 
    isPlatform: true, 
    performance: 8.7,
    description: 'Streaming and media giants'
  },
  { 
    id: 4, 
    name: 'My Watchlist', 
    stocks: ['NVDA', 'AMZN'], 
    cost: 647.16, 
    isPlatform: false, 
    performance: 5.3,
    description: 'Personal selection'
  }
];

export const generatePriceHistory = (basePrice, points = 30) => {
  const data = [];
  let price = basePrice;
  
  for (let i = 0; i < points; i++) {
    price += (Math.random() - 0.5) * basePrice * 0.02;
    data.push({ 
      time: i, 
      price: parseFloat(price.toFixed(2)),
      label: `T-${points - i}`
    });
  }
  
  return data;
};

export const MOCK_HOLDINGS = [
  { symbol: 'AAPL', name: 'Apple Inc', qty: 10, avgPrice: 175.20, currentPrice: 182.50, logo: '🍎' },
  { symbol: 'MSFT', name: 'Microsoft', qty: 5, avgPrice: 340.00, currentPrice: 335.20, logo: '💻' },
  { symbol: 'GOOGL', name: 'Alphabet', qty: 8, avgPrice: 135.50, currentPrice: 140.80, logo: '🔍' },
  { symbol: 'NVDA', name: 'NVIDIA', qty: 3, avgPrice: 470.00, currentPrice: 495.22, logo: '🎮' }
];

export const MOCK_WISHLIST = [
  { symbol: 'TSLA', name: 'Tesla', price: 238.45, change: -4.5, logo: '⚡', notes: 'Wait for dip' },
  { symbol: 'AMZN', name: 'Amazon', price: 151.94, change: 1.8, logo: '📦', notes: 'Strong buy signal' },
  { symbol: 'META', name: 'Meta', price: 352.89, change: 2.1, logo: '👤', notes: 'Watch earnings' }
];

export const MOCK_TRANSACTIONS = [
  { id: 1, timestamp: '2025-12-16 10:30', type: 'Buy', stock: 'AAPL', qty: 10, price: 175.20, total: 1752.00, status: 'success' },
  { id: 2, timestamp: '2025-12-16 09:15', type: 'Sell', stock: 'MSFT', qty: 3, price: 335.20, total: 1005.60, status: 'success' },
  { id: 3, timestamp: '2025-12-15 14:20', type: 'Buy', stock: 'GOOGL', qty: 8, price: 135.50, total: 1084.00, status: 'success' },
  { id: 4, timestamp: '2025-12-15 11:45', type: 'Bundle Buy', stock: 'Tech Giants', qty: 1, price: 1011.39, total: 1011.39, status: 'success' },
  { id: 5, timestamp: '2025-12-14 16:00', type: 'Dividend', stock: 'AAPL', qty: 10, price: 0.24, total: 2.40, status: 'success' },
  { id: 6, timestamp: '2025-12-14 13:30', type: 'Buy', stock: 'NVDA', qty: 3, price: 470.00, total: 1410.00, status: 'success' },
  { id: 7, timestamp: '2025-12-13 10:00', type: 'Sell', stock: 'TSLA', qty: 5, price: 242.00, total: 1210.00, status: 'failed' }
];

export const MOCK_ACTIVITIES = [
  { id: 1, type: 'buy', message: 'Bought 10 shares of AAPL', timestamp: '2 hours ago', icon: '📈' },
  { id: 2, type: 'sell', message: 'Sold 3 shares of MSFT', timestamp: '5 hours ago', icon: '📉' },
  { id: 3, type: 'dividend', message: 'Dividend credited: $2.40 from AAPL', timestamp: '1 day ago', icon: '💰' },
  { id: 4, type: 'alert', message: 'Price alert triggered for TSLA', timestamp: '2 days ago', icon: '🔔' },
  { id: 5, type: 'buy', message: 'Bought Tech Giants bundle', timestamp: '3 days ago', icon: '📦' }
];
