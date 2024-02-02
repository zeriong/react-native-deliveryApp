import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Order {
  orderId: string;
  start: {
    latitude: number;
    longitude: number;
  };
  end: {
    latitude: number;
    longitude: number;
  };
  price: number;
  image: string;
  completedAt: string;
}
interface InitialState {
  orders: Order[];
  deliveries: Order[];
  completes: Order[];
}
const initialState: InitialState = {
  orders: [],
  deliveries: [],
  completes: [],
};
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder(state, {payload}: PayloadAction<Order>) {
      state.orders.push(payload);
    },
    acceptOrder(state, {payload}: PayloadAction<string>) {
      const index = state.orders.findIndex(v => v.orderId === payload);
      if (index > -1) {
        state.deliveries.push(state.orders[index]);
        state.orders.splice(index, 1);
      }
    },
    rejectOrder(state, {payload}: PayloadAction<string>) {
      const index = state.orders.findIndex(v => v.orderId === payload);
      if (index > -1) {
        state.orders.splice(index, 1);
      }
      const delivery = state.deliveries.findIndex(v => v.orderId === payload);
      if (delivery > -1) {
        state.deliveries.splice(delivery, 1);
      }
    },
    setCompletes(state, {payload}) {
      state.completes = payload;
    },
  },
  extraReducers: () => {},
});

export default orderSlice;
