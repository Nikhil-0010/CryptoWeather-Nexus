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

export const getCityCoordinates = async (city) => {
  const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`);
  const geoData = await geoRes.json();

  if (!geoData.length) {
    throw new Error('City not found');
  }
  
  return { lat: geoData[0].lat, lon: geoData[0].lon };
};

export const get7DayForecast = async (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`;

  try {
    const forecastRes = await fetch(url);
    const forecastData = await forecastRes.json();

    console.log("Forecast API Response:", forecastData); // Debugging

    if (!forecastData.daily) {
      throw new Error("API response is missing 'daily' data.");
    }

    return forecastData.daily.map((day) => ({
      date: new Date(day.dt * 1000).toLocaleDateString(),
      temperature: day.temp?.day ?? 0,
      humidity: day.humidity ?? 0,
      conditions: day.weather?.[0]?.description ?? "No data",
    }));
  } catch (error) {
    console.error("Error fetching forecast:", error);
    return []; // Return empty array to prevent crashes
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