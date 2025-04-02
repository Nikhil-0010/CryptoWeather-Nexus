import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favoriteCities: ['New York', 'London', 'Tokyo'],
  favoriteCryptos: ['bitcoin', 'ethereum', 'cardano'],
  theme: 'system',
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    toggleFavoriteCity: (state, action) => {
      const city = action.payload;
      const index = state.favoriteCities.indexOf(city);
      if (index === -1) {
        state.favoriteCities.push(city);
      } else {
        state.favoriteCities.splice(index, 1);
      }
    },
    toggleFavoriteCrypto: (state, action) => {
      const crypto = action.payload;
      const index = state.favoriteCryptos.indexOf(crypto);
      if (index === -1) {
        state.favoriteCryptos.push(crypto);
      } else {
        state.favoriteCryptos.splice(index, 1);
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleFavoriteCity, toggleFavoriteCrypto, setTheme } =
  preferencesSlice.actions;
export default preferencesSlice.reducer;