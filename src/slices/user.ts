import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type TInitialState = {
  name: string;
  email: string;
  accessToken: string;
  money?: number | null;
  phoneToken?: string;
};

const initialState: TInitialState = {
  name: '',
  email: '',
  accessToken: '',
  money: 0,
  phoneToken: '',
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
    setPhoneToken(state, {payload}: PayloadAction<string>) {
      state.phoneToken = payload;
    },
  },
  extraReducers: () => {},
});

export default userSlice;
