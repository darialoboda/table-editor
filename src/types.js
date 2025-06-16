

export const createId = () => '_' + Math.random().toString(36).substr(2, 9);

export const initialState = {
  users: [],
  tables: [],
  activeUserId: null,
};
