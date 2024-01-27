import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type TInitialState = {
  name: string;
  email: string;
  accessToken: string;
  money?: number | null;
};

const initialState: TInitialState = {
  name: '',
  email: '',
  accessToken: '',
  money: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, {payload}: PayloadAction<TInitialState>) {
      state.email = payload.email;
      state.name = payload.name;
      state.accessToken = payload.accessToken;
    },
    setAccessToken(state, {payload}: PayloadAction<string>) {
      state.accessToken = payload;
    },
    setMoney(state, {payload}: PayloadAction<number>) {
      state.money = payload;
    },
  },
  extraReducers: () => {},
});

export default userSlice;
