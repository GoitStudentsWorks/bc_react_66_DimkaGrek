import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCurrentUser } from 'my-redux/User/operations';
import { api, clearToken, setToken } from 'services/api';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials, thunkAPI) => {
    try {
      console.log(credentials);
      const { data } = await api.post('/auth/register', credentials);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    console.log('login/password->>> ', credentials);
    try {
      const { data } = await api.post('/auth/login', credentials);
      setToken(data.accessToken);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await api.get('/auth/logout');
      clearToken();
      return;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const refreshUser = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    const sid = thunkAPI.getState().auth.sid;
    const refreshToken = thunkAPI.getState().auth.refreshToken;

    if (!refreshToken || !sid) {
      return thunkAPI.rejectWithValue('No token');
    }
    try {
      setToken(refreshToken);
      const { data } = await api.post('/auth/refresh', { sid: sid });
      setToken(data.accessToken);

      thunkAPI.dispatch(fetchCurrentUser());
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
