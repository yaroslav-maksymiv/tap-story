import {createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"

export const checkIsAuthenticated = createAsyncThunk('authentication/isAuthenticated', async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    const body = JSON.stringify({
        token: localStorage.getItem('access')
    })

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/verify/`, body, config)
    return response.data
})

export const loadUser = createAsyncThunk('authentication/load', async (credentials: {access: string | null}) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${credentials.access}`,
            'Accept': 'application/json'
        }
    }

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/me/`, config)
    return response.data
})

export const login = createAsyncThunk('authentication/login', async (credentials: {
    email: string,
    password: string
}, thunkAPI) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify(credentials)
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/create/`, body, config)

        if (response.status === 200) {
            thunkAPI.dispatch(loadUser({access: response.data.access}))
        }

        return response.data
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data)
    }

})

export const register = createAsyncThunk('authentication/register', async (credentials: {
    email: string, password: string, rePassword: string, username: string
}, thunkAPI) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({
        'username': credentials.username,
        'email': credentials.email,
        'password': credentials.password,
        're_password': credentials.rePassword
    })

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/`, body, config)
        return response.data
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data)
    }
})

export const activate = createAsyncThunk('authentication/activate', async (credentials: {
    uid: string,
    token: string
}, thunkAPI) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify(credentials)

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/activation/`, body, config)
        return response.data
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data)
    }
})