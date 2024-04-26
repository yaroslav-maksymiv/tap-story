import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {loadUser, login, register, checkIsAuthenticated, activate} from "./authenticationThunks";
import {createErrorsList} from "../../miscellaneous";

export type User = {
    id: number
    email: string
    username: string
    first_name: string | null
    last_name: string | null
    photo: string | null
}

type AuthenticationState = {
    access: string | null
    refresh: string | null
    user: User | null
    isAuthenticated: boolean
    loginErrors: string[] | null
    registerErrors: string[] | null
    isAccountActivated: boolean
    isRegistered: boolean
    loginLoading: boolean
    registerLoading: boolean
}

const initialState: AuthenticationState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    user: null,
    isAuthenticated: false,
    loginErrors: null,
    registerErrors: null,
    isAccountActivated: false,
    isRegistered: false,
    loginLoading: false,
    registerLoading: false
}

const setAuthentication = (state: AuthenticationState, isAuthenticated: boolean): void => {
    const authStatus = isAuthenticated ? 'true' : 'false'
    localStorage.setItem('isAuthenticated', authStatus)
    state.isAuthenticated = isAuthenticated
    state.isAccountActivated = isAuthenticated
}

const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('isAuthenticated')
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')

            state.access = null
            state.refresh = null
            state.isAuthenticated = false
            state.user = null
            state.loginErrors = null
            state.registerErrors = null
            state.isAccountActivated = false
            state.isRegistered = false
            state.loginLoading = false
            state.registerLoading = false
        },
        resetIsRegistered: (state) => {
            state.isRegistered = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            const {access, refresh} = action.payload

            localStorage.setItem('isAuthenticated', 'true')
            localStorage.setItem('access', access)
            localStorage.setItem('refresh', refresh)

            state.isAuthenticated = true
            state.access = access
            state.refresh = refresh
            state.loginErrors = []
            state.loginLoading = false
        })
        builder.addCase(login.pending, (state) => {
            state.loginLoading = true
        })
        builder.addCase(login.rejected, (state, action) => {
            state.loginLoading = false
            if (action.payload) {
                if (Object.keys(action.payload).length > 1) {
                    state.loginErrors = createErrorsList(action.payload)
                } else {
                    state.loginErrors = [Object.values(action.payload)[0]]
                }
            } else {
                state.loginErrors = action.error.message ? [action.error.message] : null
            }
        })
        builder.addCase(loadUser.fulfilled, (state, action: PayloadAction<User>) => {
            state.user = action.payload
        })
        builder.addCase(loadUser.rejected, (state) => {
            state.user = null
        })
        builder.addCase(register.fulfilled, (state) => {
            state.isRegistered = true
            state.registerErrors = null
            state.registerLoading = false
        })
         builder.addCase(register.pending, (state) => {
            state.registerLoading = true
        })
        builder.addCase(register.rejected, (state, action) => {
            state.registerLoading = false
            if (action.payload) {
                if (Object.keys(action.payload).length > 1) {
                    state.registerErrors = createErrorsList(action.payload)
                } else {
                    state.registerErrors = [Object.values(action.payload)[0]]
                }
            } else {
                state.loginErrors = action.error.message ? [action.error.message] : null
            }
        })
        builder.addCase(checkIsAuthenticated.fulfilled, (state, action) => {
            if (action.payload.code !== 'token_not_valid') {
                setAuthentication(state, true)
            } else {
                setAuthentication(state, false)
            }
        })
        builder.addCase(checkIsAuthenticated.rejected, (state) => {
            setAuthentication(state, false)
        })
        builder.addCase(activate.fulfilled, (state) => {
            state.isAccountActivated = true
        })
    }
})

export default authenticationSlice.reducer
export const {logout, resetIsRegistered} = authenticationSlice.actions