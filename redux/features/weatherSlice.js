import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  cities: {
    'New York': {
      temperature: 0,
      humidity: 0,
      conditions: '',
      loading: false,
      error: null,
    },
    'London': {
      temperature: 0,
      humidity: 0,
      conditions: '',
      loading: false,
      error: null,
    },
    'Tokyo': {
      temperature: 0,
      humidity: 0,
      conditions: '',
      loading: false,
      error: null,
    },
  },
  alerts: [],
};

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (city) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
    );
    const data = await response.json();
    console.log("data",data);
    return { city, data };
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    addWeatherAlert: (state, action) => {
      state.alerts.push({
        ...action.payload,
        timestamp: Date.now(),
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state, action) => {
        const city = action.meta.arg;
        state.cities[city].loading = true;
        state.cities[city].error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        const { city, data } = action.payload;
        state.cities[city] = {
          temperature: data.main?.temp,
          humidity: data.main?.humidity,
          conditions: data?.weather?.length > 0 ? data.weather[0].main : '',
          loading: false,
          error: null,
        };
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        const city = action.meta.arg;
        state.cities[city].loading = false;
        state.cities[city].error = 'Failed to fetch weather data';
      });
  },
});

export const { addWeatherAlert } = weatherSlice.actions;
export default weatherSlice.reducer;