import React, {useEffect, useState} from "react";
import {ErrorAlert} from "../../components/ErrorAlert";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useNavigate} from "react-router-dom";
import {resetPassword} from "./authenticationThunks";
import {Bounce, toast, ToastContainer} from "react-toastify";


export const PasswordReset: React.FC = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const {passwordResetLoading, passwordResetErrors} = useAppSelector(state => state.authentication)

    const [errorMessages, setErrorMessages] = useState<string[]>([])
    const [email, setEmail] = useState<string>('')

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        dispatch(resetPassword({email})).then(response => {
            if (resetPassword.fulfilled.match(response)) {
                toast(`Message to reset password was sent to email: ${email}`, {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    theme: "dark",
                    transition: Bounce
                })
                setTimeout(() => {
                    navigate('/')
                }, 4000)
            }
        })
    }

    useEffect(() => {
        if (passwordResetErrors) {
            setErrorMessages(passwordResetErrors)
        }
    }, [passwordResetErrors])

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
                        Reset Password
                    </h2>
                </div>

                <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                    {errorMessages && (
                        <div className="mb-4">
                            {errorMessages.map((error: string) => <div className="mb-1"><ErrorAlert text={error}
                                                                                                    setErrors={setErrorMessages}/>
                            </div>)}
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
                                    onChange={e => setEmail(e.target.value)}
                                    value={email}
                                    disabled={passwordResetLoading}
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-white placeholder-gray-500 bg-gray-800 sm:text-sm sm:leading-6 outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={e => handleSubmit(e)}
                                type="submit"
                                disabled={passwordResetLoading}
                                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {passwordResetLoading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </form>
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
        </>)
}