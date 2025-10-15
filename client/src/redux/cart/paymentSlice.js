import { createSlice } from '@reduxjs/toolkit';

const initialPaymentState = {
  method: 'card',    // 'card', 'upi', 'netBanking', or 'cod'
  cardNumber: '',
  expiry: '',
  cvv: '',
  upiId: '',
  bankName: '',
  accountNumber: '',
  codConfirmed: false
};

export const paymentSlice = createSlice({
  name: 'payment',
  initialState: initialPaymentState,
  reducers: {
    updatePayment(state, action) {
      return { ...state, ...action.payload };
    },
    clearPayment() {
      return initialPaymentState;
    }
  }
});
export const { updatePayment, clearPayment } = paymentSlice.actions;
export default paymentSlice.reducer;