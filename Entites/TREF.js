import trefsData from './TREF.json';

export const TREF = {
  async list() {
    return Array.isArray(trefsData?.items) ? trefsData.items : [];
  },
};
