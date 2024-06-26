import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from '../../app/hooks'
import {login} from "./authenticationThunks";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {ErrorAlert} from "../../components/ErrorAlert";

type FormData = {
    email: string
    password: string
}

export const Login: React.FC = () => {
    const location = useLocation()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const {isAuthenticated, loginLoading, loginErrors} = useAppSelector(state => state.authentication)

    const [errorMessages, setErrorMessages] = useState<string[]>([])
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: ''
    })

    useEffect(() => {
        if (loginErrors) {
            setErrorMessages(loginErrors)
        }
    }, [loginErrors])

    const validateForm = () => {
        const errors = []

        if (!formData.email) {
            errors.push('Email is required')
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.push('Email is invalid')
        }

        if (!formData.password) {
            errors.push('Password is required')
        } else if (formData.password.length < 6) {
            errors.push('Password must be at least 6 characters')
        }

        return errors
    }

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        const errors = validateForm()
        setErrorMessages(errors)
        dispatch(login(formData))
    }

    const redirectUrl = new URLSearchParams(location.search).get('redirect')

    useEffect(() => {
        if (isAuthenticated) {
            if (redirectUrl) {
                navigate(`/${redirectUrl}`)
            } else {
                navigate('/')
            }
        }
    }, [isAuthenticated, navigate])

    return (
        <>
            <div
                className="pt-12 flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-black text-white">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-12 w-auto"
                        src={require("../../assets/logo.png")}
                        alt="Your Company"
                    />
                    <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight">
                        Sign in
                    </h2>
                </div>

                <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                    {errorMessages && (
                        <div className="mb-4">
                            {errorMessages.map((error: string) => <div className="mb-1"><ErrorAlert text={error} setErrors={setErrorMessages}/></div>)}
                        </div>
                    )}
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    onChange={e => handleFormChange(e)}
                                    value={formData.email}
                                    disabled={loginLoading}
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-white placeholder-gray-500 bg-gray-800 sm:text-sm sm:leading-6 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <Link to={'/password-reset'}
                                          className="font-semibold text-blue-400 hover:text-blue-300">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    onChange={e => handleFormChange(e)}
                                    value={formData.password}
                                    disabled={loginLoading}
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-white placeholder-gray-500 bg-gray-800 sm:text-sm sm:leading-6 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={e => handleSubmit(e)}
                                type="submit"
                                disabled={loginLoading}
                                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {loginLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account yet?
                        <Link to={'/register'} className="font-semibold leading-6 text-blue-400 hover:text-blue-300">
                            &nbsp;Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}