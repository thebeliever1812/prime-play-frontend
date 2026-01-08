import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DonationState = {
    dismissedForever: boolean;
    lastShownAt: number | null;
};

const initialState: DonationState = {
    dismissedForever:
        typeof window !== "undefined"
            ? localStorage.getItem("donation_dismissed") === "true"
            : false,
    lastShownAt:
        typeof window !== "undefined"
            ? Number(localStorage.getItem("donation_last_shown")) || null
            : null,
};

const donationSlice = createSlice({
    name: "donation",
    initialState,
    reducers: {
        setDismissedForever(state, action: PayloadAction<boolean>) {
            state.dismissedForever = action.payload;
            localStorage.setItem("donation_dismissed", String(action.payload));
        },
        setLastShownAt(state, action: PayloadAction<number>) {
            state.lastShownAt = action.payload;
            localStorage.setItem("donation_last_shown", String(action.payload));
        },
    },
});

export const { setDismissedForever, setLastShownAt } = donationSlice.actions;
export default donationSlice.reducer;
