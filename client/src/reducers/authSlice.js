import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   token: "",
// };
const initialState = JSON.parse(sessionStorage.getItem("token")) || {
  token: "",
  user: {
    email: "",
    firstName: "",
    lastName: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zip: "",
    },
    location: {
      coordinates: [],
    },
    phone: "",
    photo: "",
    ordersCount: 0,
  },
  seller: {
    email: "",
    firstName: "",
    lastName: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zip: "",
    },
    location: {
      coordinates: [],
    },
    phone: "",
    photo: "",
    companyName: "",
    businessRegistrationNumber: "",
    bankName: "",
    accountNumber: "",
    ordersCount: 0,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: {
      prepare(token, user) {
        return { payload: { token, user } };
      },
      reducer(state, action) {
        state.token = action.payload.token;
        state.user = action.payload.user;
      },
    },
    updateUserData: {
      prepare(user) {
        return { payload: user };
      },
      reducer(state, action) {
        state.user = action.payload;
      },
    },
    updateSellerData: {
      prepare(seller) {
        return { payload: seller };
      },
      reducer(state, action) {
        state.seller = action.payload;
      },
    },
    updateUserLocation: {
      reducer(state, action) {
        state.user.location.coordinates = action.payload;
      },
    },
    setSellerToken: {
      prepare(token, seller) {
        return { payload: { token, seller } };
      },
      reducer(state, action) {
        state.token = action.payload.token;
        state.seller = action.payload.seller;
      },
    },
    logoutBoth: {
      reducer(state, action) {
        state.token = "";
        state.user = {
          email: "",
          firstName: "",
          lastName: "",
          address: { street: "", city: "", state: "", country: "", zip: "" },
          location: { coordinates: [] },
          phone: "",
          photo: "",
          ordersCount: 0,
        };
        state.seller = {
          email: "",
          firstName: "",
          lastName: "",
          address: { street: "", city: "", state: "", country: "", zip: "" },
          location: { coordinates: [] },
          phone: "",
          photo: "",
          companyName: "",
          businessRegistrationNumber: "",
          bankName: "",
          accountNumber: "",
          ordersCount: 0,
        };
      },
    },
  },
});
export const {
  setToken,
  updateUserData,
  updateUserLocation,
  setSellerToken,
  updateSellerData,
  logoutBoth,
} = authSlice.actions;

export default authSlice.reducer;
