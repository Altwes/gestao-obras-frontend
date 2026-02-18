import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface User {
    nome: string;
    email: string;
    perfil?: string;
}
interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    token: null,
    user: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<{ token: string; user: User }>) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('@gestao-obras:token');
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;