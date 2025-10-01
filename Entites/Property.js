import propertiesData from './Property.json';

const API_BASE = '/api/properties';

export const Property = {
  async list(sort = '') {
    try {
      const params = sort ? `?sort=${encodeURIComponent(sort)}` : '';
      const res = await fetch(`${API_BASE}${params}`, { credentials: 'include' });
      if (!res.ok) throw new Error('network');
      const data = await res.json();
      return Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
    } catch (e) {
      return Array.isArray(propertiesData?.items) ? propertiesData.items : [];
    }
  },
};
