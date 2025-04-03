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

export const get7DayForecast = async (city) => {
  try {
    // Fetch 7-day forecast from WeatherAPI
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHERAPI_KEY}&q=${city}&days=7&aqi=no&alerts=no`;
    const response = await fetch(url);
    const data = await response.json();

    // ("API Response:", data); // Debugging

    if (!data.forecast || !data.forecast.forecastday) {
      throw new Error("API response is missing 'forecastday' data.");
    }

    // Extract relevant details
    const forecast = data.forecast.forecastday.map((day) => ({
      date: day.date,
      temperature: day.day.avgtemp_c,
      humidity: day.day.avghumidity,
      conditions: day.day.condition.text,
    }));

    return forecast;
  } catch (error) {
    console.error("Error fetching 7-day forecast:", error);
    return [];
  }
};

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (city) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
    );
    const data = await response.json();
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