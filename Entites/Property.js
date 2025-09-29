import propertiesData from './Property.json';

export const Property = {
  async list() {
    return Array.isArray(propertiesData?.items) ? propertiesData.items : [];
  },
};
