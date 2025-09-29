import userData from './User.json';

export const User = {
  async me() {
    return userData?.me || null;
  },
};
