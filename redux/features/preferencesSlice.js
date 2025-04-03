import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favoriteCities: ['New York'],
  favoriteCryptos: ['bitcoin'],
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
        localStorage.setItem('favoriteCities', JSON.stringify(state.favoriteCities));
      } else {
        state.favoriteCities.splice(index, 1);
        localStorage.setItem('favoriteCities', JSON.stringify(state.favoriteCities));
      }
    },
    toggleFavoriteCrypto: (state, action) => {
      const crypto = action.payload;
      const index = state.favoriteCryptos.indexOf(crypto);
      if (index === -1) {
        state.favoriteCryptos.push(crypto);
        localStorage.setItem('favoriteCryptos', JSON.stringify(state.favoriteCryptos));
      } else {
        state.favoriteCryptos.splice(index, 1);
        localStorage.setItem('favoriteCryptos', JSON.stringify(state.favoriteCryptos));
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    loadPreferences: (state) => {
      const favoriteCities = localStorage.getItem('favoriteCities');
      const favoriteCryptos = localStorage.getItem('favoriteCryptos');
      const theme = localStorage.getItem('theme');
      if (favoriteCities) {
        state.favoriteCities = JSON.parse(favoriteCities);
      }
      if (favoriteCryptos) {
        state.favoriteCryptos = JSON.parse(favoriteCryptos);
      }
      if (theme) {
        state.theme = theme;
      }
    }
  },
});

export const { toggleFavoriteCity, toggleFavoriteCrypto, setTheme, loadPreferences } =
  preferencesSlice.actions;
export default preferencesSlice.reducer;