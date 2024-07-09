import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index"; // Import the RootState type

interface ModalState {
  isOpen: boolean;
}

const initialState: ModalState = { isOpen: false };

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<React.ReactNode>) => {
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;

// Selector function
export const selectModal = (state: RootState) => state.modal;
