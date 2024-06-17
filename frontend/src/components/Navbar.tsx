import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {logout} from "../features/authentication/authenticationSlice";
import {Notifications} from "../features/notification/Notifications";
import {countUnreadNotifications} from "../features/notification/notificationThunk";
import {resetNotificationsCount} from "../features/notification/notificationSlice";
import {randomStory} from "../features/story/storyThunks";

export const Navbar: React.FC = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const {isAuthenticated, user} = useAppSelector(state => state.authentication)
    const {notificationsCount} = useAppSelector(state => state.notification)

    const [notificationsVisible, setNotificationsVisible] = useState<boolean>(false)
    const [menuVisible, setMenuVisible] = useState<boolean>(false)

    useEffect(() => {
        if (notificationsVisible) {
            dispatch(resetNotificationsCount())
        }
    }, [notificationsVisible, notificationsCount])

    useEffect(() => {
        if (menuVisible) {
            const handleClickOutside = (event: MouseEvent) => {
                const target = event.target as HTMLElement
                if (!target.closest('.menu') && !target.closest('.menu-activate')) {
                    setMenuVisible(false)
                }
            }

            document.addEventListener('click', handleClickOutside)

            return () => {
                document.removeEventListener('click', handleClickOutside)
            }
        }
    }, [setMenuVisible, menuVisible])

    useEffect(() => {
        dispatch(countUnreadNotifications({}))
    }, [])

    const handleLogout = () => {
        dispatch(logout())
    }

    const getRandomStory = () => {
        dispatch(randomStory()).then(response => {
            navigate(`/story/${response.payload.id}`)
        })
    }

    return (
        <header className="fixed z-20">

            {notificationsVisible && (
                <Notifications setNotificationsVisible={setNotificationsVisible}/>
            )}

            <nav
                className="absolute z-20 top-0 left-0 w-screen bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-900">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to={'/'} className="flex items-center">
                        <img src={require("../assets/logo.png")} className="mr-3 h-6 sm:h-9"
                             alt="Logo"/>
                        <span
                            className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Tap Story</span>
                    </Link>
                    <div className="flex items-center lg:order-2 relative">
                        {isAuthenticated ? (<>
                            <Link to={'story/create'}>
                                <div
                                    className="mr-4 text-white text-sm bg-gray-800 rounded-md px-2 py-1 cursor-pointer flex items-center gap-1.5">
                                    Create
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M12 4.5v15m7.5-7.5h-15"/>
                                    </svg>
                                </div>
                            </Link>
                            <div className="mr-4 text-white cursor-pointer">
                                <Link to={'/library'}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"/>
                                    </svg>
                                </Link>
                            </div>
                            <div onClick={() => setNotificationsVisible(prev => !prev)}
                                 className="notifications-open flex gap-1 items-center mr-4 text-white cursor-pointer">
                                {notificationsCount > 0 && (notificationsCount > 10 ? <div>9+</div> :
                                    <div>{notificationsCount}</div>)}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"/>
                                </svg>
                            </div>
                            <div className="relative">
                                <div onClick={() => setMenuVisible(prevState => !prevState)} className="menu-activate">
                                    <div className="cursor-pointer">
                                        {user?.photo ? (
                                            <img src={require("../assets/avatar.jpg")}
                                                 className="w-10 h-10 rounded-full"
                                                 alt="Avatar"/>
                                        ) : (
                                            <img src={require("../assets/avatar.jpg")}
                                                 className="w-10 h-10 rounded-full"
                                                 alt="Avatar"/>
                                        )}
                                    </div>
                                </div>
                                {user && menuVisible && (
                                    <div
                                        className="menu text-white w-52 absolute top-14 right-0 bg-gray-800 px-2 py-3 rounded-md flex flex-col gap-2">
                                        {/*<Link to={`/profile/${user.id}`}>*/}
                                        {/*    <div className="hover:bg-gray-700 px-1 rounded-md">Profile</div>*/}
                                        {/*</Link>*/}
                                        <Link to={'/my/stories'}>
                                            <div className="hover:bg-gray-700 px-1 rounded-md">My Stories</div>
                                        </Link>
                                    </div>
                                )}
                            </div>
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
                            <li><Link to={'/'}
                                      className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                                      aria-current="page">Stories 👻</Link></li>
                            <li>
                                <div
                                    onClick={() => getRandomStory()}
                                    className="cursor-pointer block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                                    aria-current="page">Random Story 🎲
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}