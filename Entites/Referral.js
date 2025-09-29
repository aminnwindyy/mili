let referrals = [];

export const Referral = {
  async filter(query) {
    if (!query) return referrals;
    return referrals.filter((r) => Object.entries(query).every(([k, v]) => r?.[k] === v));
  },
  async create(item) {
    const newItem = { id: `ref-${Date.now()}`, ...item };
    referrals.push(newItem);
    return newItem;
  },
};
