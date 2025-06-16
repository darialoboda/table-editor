import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { initialState } from '../types';

const StateContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_USER':
      return { ...state, activeUserId: action.payload };

    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };

    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map((u) => u.id === action.payload.id ? action.payload : u),
      };

    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter((u) => u.id !== action.payload),
        activeUserId: state.activeUserId === action.payload ? null : state.activeUserId,
      };

    case 'ADD_TABLE':
      return { ...state, tables: [...state.tables, action.payload] };

    case 'UPDATE_TABLE_NAME':
      return {
        ...state,
        tables: state.tables.map((t) =>
          t.id === action.payload.id ? { ...t, name: action.payload.name } : t
        ),
      };

    case 'DELETE_TABLE':
      return { ...state, tables: state.tables.filter((t) => t.id !== action.payload) };

    case 'ADD_ROW':
      return {
        ...state,
        tables: state.tables.map((t) =>
          t.id === action.payload.tableId
            ? { ...t, rows: [...t.rows, action.payload.row] }
            : t
        ),
      };

    case 'UPDATE_ROW':
      return {
        ...state,
        tables: state.tables.map((t) =>
          t.id === action.payload.tableId
            ? {
                ...t,
                rows: t.rows.map((r) =>
                  r.id === action.payload.row.id ? action.payload.row : r
                ),
              }
            : t
        ),
      };

    case 'DELETE_ROW':
      return {
        ...state,
        tables: state.tables.map((t) =>
          t.id === action.payload.tableId
            ? {
                ...t,
                rows: t.rows.filter((r) => r.id !== action.payload.rowId),
              }
            : t
        ),
      };

    case 'LOAD_FROM_STORAGE':
      return action.payload;

    default:
      return state;
  }
};

export const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const saved = localStorage.getItem('appState');
    return saved ? JSON.parse(saved) : init;
  });

  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => useContext(StateContext);
