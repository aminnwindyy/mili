import loyaltyData from './LoyaltyProgram.json';

export const LoyaltyProgram = {
  async getCurrent() {
    return loyaltyData || null;
  },
};
