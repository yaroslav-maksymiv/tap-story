import React from "react";
import {Link} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {logout} from "../features/authentication/authenticationSlice";

export const Navbar: React.FC = () => {
    const dispatch = useAppDispatch()
    const {isAuthenticated, user} = useAppSelector(state => state.authentication)

    const handleLogout = () => {
        dispatch(logout())
    }

    return (
        <header>
            <nav
                className="absolute top-0 left-0 w-screen bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-900">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to={'/'} className="flex items-center">
                        <img src={require("../assets/logo.png")} className="mr-3 h-6 sm:h-9"
                             alt="Logo"/>
                        <span
                            className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Tap Story</span>
                    </Link>
                    <div className="flex items-center lg:order-2">
                        {isAuthenticated ? (<>
                            {user?.photo ? (<Link to={'/'}>
                                <img src={require("../assets/avatar.jpg")} className="w-10 h-10 rounded-full"
                                     alt="Avatar"/>
                            </Link>) : (<Link to={'/'}>
                                <img src={require("../assets/avatar.jpg")} className="w-10 h-10 rounded-full"
                                     alt="Avatar"/>
                            </Link>)}
                            <div onClick={handleLogout}
                                 className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 ml-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800 cursor-pointer">Logout
                            </div>
                        </>) : (<>
                            <Link to={'/login'}
                                  className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Sign
                                in</Link>
                            <Link to={'/register'}
                                  className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Sign
                                up</Link>
                        </>)}

                        <button data-collapse-toggle="mobile-menu-2" type="button"
                                className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                aria-controls="mobile-menu-2" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                      clip-rule="evenodd"></path>
                            </svg>
                            <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clip-rule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                         id="mobile-menu-2">
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <Link to={'/'}
                                      className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                                      aria-current="page">Main 💻</Link>
                            </li>
                            <li><Link to={'/search'}
                                      className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                                      aria-current="page">Search 🔎</Link></li>
                            <li><Link to={'/top-ranked'}
                                      className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                                      aria-current="page">Top Ranked 🏆</Link></li>
                            <li>
                                <div
                                      className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                                      aria-current="page">Random Story 🎲</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}