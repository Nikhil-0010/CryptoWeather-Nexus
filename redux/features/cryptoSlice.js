import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  cryptocurrencies: {
    bitcoin: {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 0.0,
      priceChange24h: 0,
      marketCap: 0,
      loading: false,
      error: null,
    },
    ethereum: {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      price: 0.0,
      priceChange24h: 0,
      marketCap: 0,
      loading: false,
      error: null,
    },
    cardano: {
      id: 'cardano',
      name: 'Cardano',
      symbol: 'ADA',
      price: 0.0,
      priceChange24h: 0,
      marketCap: 0,
      loading: false,
      error: null,
    },
  },
  websocketConnected: false,
};

export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (id) => {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=inr,usd,eur,gbp,jpy&include_24hr_change=true&include_market_cap=true`
    );
    const data = await response.json();
    return { id, data };
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updateCryptoPrice: (state, action) => {
      const { id, price } = action.payload;
      if (state.cryptocurrencies[id]) {
        state.cryptocurrencies[id].price = price;
      }
    },
    setWebsocketConnected: (state, action) => {
      state.websocketConnected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state, action) => {
        const id = action.meta.arg;
        state.cryptocurrencies[id].loading = true;
        state.cryptocurrencies[id].error = null;
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        state.cryptocurrencies[id] = {
          ...state.cryptocurrencies[id],
          price: data[id].usd,
          priceChange24h: data[id].usd_24h_change,
          marketCap: data[id].usd_market_cap,
          loading: false,
          error: null,
        };
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        const id = action.meta.arg;
        state.cryptocurrencies[id].loading = false;
        state.cryptocurrencies[id].error = 'Failed to fetch crypto data';
      });
  },
});

export const { updateCryptoPrice, setWebsocketConnected } = cryptoSlice.actions;
export default cryptoSlice.reducer;