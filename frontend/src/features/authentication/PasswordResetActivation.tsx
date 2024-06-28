import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {Link, useNavigate, useParams} from "react-router-dom";
import {resetPasswordConfirm} from "./authenticationThunks";
import {ErrorAlert} from "../../components/ErrorAlert";

export const PasswordResetActivation: React.FC = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const {uid, token} = useParams()
    const [errorMessages, setErrorMessages] = useState<string[]>([])
    const [password, setPassword] = useState<string>('')
    const [rePassword, setRePassword] = useState<string>('')
    const {passwordResetErrors, passwordResetLoading} = useAppSelector(state => state.authentication)

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if (uid && token) {
            if (password !== rePassword && password.length >= 8) {
                setErrorMessages(prev => ['Passwords do not match', ...prev])
                return
            }
            dispatch(resetPasswordConfirm({uid, token, password, rePassword})).then(response => {
                if (resetPasswordConfirm.fulfilled.match(response)) {
                    setTimeout(() => {
                        navigate('/login')
                    }, 2000)
                }
            })
        }
    }

    useEffect(() => {
        if (passwordResetErrors) {
            setErrorMessages(passwordResetErrors)
        }
    }, [passwordResetErrors])

    return (
        <div className="pt-12 flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-black text-white">
            <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight">
                Reset Password
            </h2>
            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                {errorMessages && (
                    <div className="mb-4">
                        {errorMessages.map((error: string) => <div className="mb-1"><ErrorAlert text={error}
                                                                                                setErrors={setErrorMessages}/>
                        </div>)}
                    </div>
                )}
                <form>
                    <div className="mb-3">
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
                                onChange={e => setPassword(e.target.value)}
                                value={password}
                                disabled={passwordResetLoading}
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-white placeholder-gray-500 bg-gray-800 sm:text-sm sm:leading-6 outline-none"
                            />
                        </div>
                    </div>
                    <div className="mb-5">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6">
                                Re-Password
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
                                id="rePassword"
                                name="rePassword"
                                type="password"
                                autoComplete="current-password"
                                required
                                onChange={e => setRePassword(e.target.value)}
                                value={rePassword}
                                disabled={passwordResetLoading}
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-white placeholder-gray-500 bg-gray-800 sm:text-sm sm:leading-6 outline-none"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        onClick={(e) => handleSubmit(e)}
                        disabled={passwordResetLoading}
                        className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {passwordResetLoading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    )
}