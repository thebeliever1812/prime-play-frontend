import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    _id: string;
    username: string;
    fullName: string;
    email: string;
    avatar: string;
    coverImage: string;
}

interface UserState {
    user: User | null;
    loading: boolean;
}

const initialState: UserState = {
    user: null,
    loading: true,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.loading = false;
        },
        clearUser: (state) => {
            state.user = null;
            state.loading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
