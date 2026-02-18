import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    token: string | null;
    usuario: string | null; // Guardaremos apenas o login/nome enviado
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    token: null,
    usuario: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<{ token: string; usuario: string }>) => {
            state.token = action.payload.token;
            state.usuario = action.payload.usuario;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.token = null;
            state.usuario = null;
            state.isAuthenticated = false;
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;