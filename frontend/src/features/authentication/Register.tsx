import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from '../../app/hooks'
import {register} from "./authenticationThunks";
import {Link, useNavigate} from "react-router-dom";
import {ErrorAlert} from "../../components/ErrorAlert";
import {ToastContainer, toast, Bounce} from 'react-toastify';
import {resetIsRegistered} from "./authenticationSlice";

type FormData = {
    email: string
    password: string
    rePassword: string
    username: string
}

export const Register: React.FC = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const {
        registerErrors,
        isAuthenticated,
        isRegistered,
        registerLoading
    } = useAppSelector(state => state.authentication)

    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        rePassword: '',
        username: ''
    })

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        dispatch(register(formData))
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        } else if (isRegistered) {
            toast('You have successfully registered!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true,
                theme: "dark",
                transition: Bounce
            })
            setTimeout(() => {
                navigate('/login')
                dispatch(resetIsRegistered())
            }, 2000)
        }
    }, [isRegistered, isAuthenticated, navigate])

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
                        Sign up
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    {registerErrors && (
                        <div className="mb-4">
                            {registerErrors.map((error: string) => <ErrorAlert text={error}/>)}
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
                                    disabled={registerLoading}
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-white placeholder-gray-500 bg-gray-800 sm:text-sm sm:leading-6 outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium leading-6">
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    onChange={e => handleFormChange(e)}
                                    value={formData.username}
                                    disabled={registerLoading}
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-white placeholder-gray-500 bg-gray-800 sm:text-sm sm:leading-6 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6">
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    onChange={e => handleFormChange(e)}
                                    value={formData.password}
                                    disabled={registerLoading}
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-white placeholder-gray-500 bg-gray-800 sm:text-sm sm:leading-6 outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="rePassword" className="block text-sm font-medium leading-6">
                                Confirm Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="rePassword"
                                    name="rePassword"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    onChange={e => handleFormChange(e)}
                                    value={formData.rePassword}
                                    disabled={registerLoading}
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-white placeholder-gray-500 bg-gray-800 sm:text-sm sm:leading-6 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={e => handleSubmit(e)}
                                type="submit"
                                disabled={registerLoading}
                                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                                {registerLoading ? 'Signing up...' : 'Sign up'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to={'/login'} className="font-semibold leading-6 text-blue-400 hover:text-blue-300">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="dark"
                transition={Bounce}
            />

        </>
    )
}