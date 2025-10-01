import investmentsData from './Investment.json';

export const Investment = {
  async list() {
    return Array.isArray(investmentsData?.items) ? investmentsData.items : [];
  },
  async filter(query) {
    const items = Array.isArray(investmentsData?.items) ? investmentsData.items : [];
    if (!query || typeof query !== 'object') return items;
    return items.filter((item) => {
      return Object.entries(query).every(([key, value]) => item?.[key] === value);
    });
  },
};
