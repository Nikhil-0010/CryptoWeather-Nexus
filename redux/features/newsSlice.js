import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  articles: [],
  loading: false,
  error: null,
};

export const fetchNewsData = createAsyncThunk('news/fetchNewsData', async (_, { rejectWithValue }) => {
  try{
  const response = await fetch(
    `https://newsdata.io/api/1/news?apikey=${process.env.NEXT_PUBLIC_NEWSDATA_API_KEY}&q=cryptocurrency&language=en`
  );
  const data = await response.json();
  if(data.status ==='error'){
    throw new Error(data.results.message);
  }
  // console.log('API Response:', data); //Debugging
  return data.results.slice(0, 5);
}catch (error){
  return rejectWithValue(error.message || 'Failed to fetch news data');
}
});

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsData.fulfilled, (state, action) => {
        state.articles = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchNewsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default newsSlice.reducer;