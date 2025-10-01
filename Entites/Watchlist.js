let watchlistItems = [];

export const Watchlist = {
  async filter(query) {
    if (!query) return watchlistItems;
    return watchlistItems.filter((item) =>
      Object.entries(query).every(([k, v]) => item?.[k] === v)
    );
  },
  async create(item) {
    const newItem = { id: `wl-${Date.now()}`, ...item };
    watchlistItems.push(newItem);
    return newItem;
  },
  async delete(id) {
    watchlistItems = watchlistItems.filter((i) => i.id !== id);
    return { success: true };
  },
};
