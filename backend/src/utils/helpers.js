const jwt = require('jsonwebtoken');

// Generate access token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { 
      expiresIn: process.env.JWT_EXPIRE || '1h',
      issuer: 'melkchain-api',
      audience: 'melkchain-client'
    }
  );
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    { 
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
      issuer: 'melkchain-api',
      audience: 'melkchain-client'
    }
  );
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Validate Iranian phone number
const isValidPhone = (phone) => {
  const phoneRegex = /^(\+98|0)?9\d{9}$/;
  return phoneRegex.test(phone);
};

// Validate Iranian national ID
const isValidNationalId = (nationalId) => {
  if (!/^\d{10}$/.test(nationalId)) return false;
  
  const check = parseInt(nationalId[9]);
  const sum = nationalId.split('').slice(0, 9).reduce((acc, digit, index) => {
    return acc + parseInt(digit) * (10 - index);
  }, 0);
  
  const remainder = sum % 11;
  return remainder < 2 ? check === remainder : check === 11 - remainder;
};

// Generate random string
const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Format currency (Iranian Rial)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fa-IR', {
    style: 'currency',
    currency: 'IRR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Sanitize input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

// Calculate token price based on property value
const calculateTokenPrice = (propertyValue, totalTokens) => {
  return Math.floor(propertyValue / totalTokens);
};

// Calculate investment return
const calculateReturn = (initialAmount, currentValue) => {
  const profit = currentValue - initialAmount;
  const percentage = (profit / initialAmount) * 100;
  return {
    profit,
    percentage: Math.round(percentage * 100) / 100
  };
};

module.exports = {
  generateToken,
  generateRefreshToken,
  isValidEmail,
  isValidPhone,
  isValidNationalId,
  generateRandomString,
  formatCurrency,
  sanitizeInput,
  calculateTokenPrice,
  calculateReturn
};