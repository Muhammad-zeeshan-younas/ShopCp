import { Action, configureStore } from "@reduxjs/toolkit";
import rootReducer, { RootState } from "../reducers";
import { ThunkAction } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
