import { combineReducers } from "redux";
import modalSlices from "./slices/modalSlices";
import userSlice from "./slices/userSlice";
import cartSlice from "./slices/cartSlice";

interface RootState {
  user: ReturnType<typeof userSlice>;
  modal: ReturnType<typeof modalSlices>;
  cart: ReturnType<typeof cartSlice>;
}

const rootReducer = combineReducers({
  user: userSlice,
  modal: modalSlices,
  cart: cartSlice,
});

export default rootReducer;

export type { RootState };
