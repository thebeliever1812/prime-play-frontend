import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DonationState = {
    dismissedForever: boolean;
    lastShownAt: number | null;
};

const initialState: DonationState = {
    dismissedForever: false,
    lastShownAt: null,
};

const donationSlice = createSlice({
    name: "donation",
    initialState,
    reducers: {
        setDismissedForever(state, action: PayloadAction<boolean>) {
            state.dismissedForever = action.payload;
        },
        setLastShownAt(state, action: PayloadAction<number>) {
            state.lastShownAt = action.payload;
        },
    },
});

export const { setDismissedForever, setLastShownAt } = donationSlice.actions;
export default donationSlice.reducer;
